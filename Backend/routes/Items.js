const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Item = require("../models/Item");
const Match = require("../models/Match");
const User = require("../models/User");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middlewares");
const { MATCH_THRESHOLD, matchingAlgo } = require("../Alogirthms");
const { sendMatchFoundEmail, sendClaimEmail } = require("../controllers/SendEmail");

const isValidId = (id) => mongoose.isValidObjectId(id);
const normalizeText = (value) => String(value || "").trim().toLowerCase();

const sendMatchNotification = async (email, lostItem, foundItem, match) => {
    try {
        await sendMatchFoundEmail({
            email,
            lostItem,
            foundItem,
            similarity: match.similarity,
            matchId: match._id
        });
    } catch (error) {
        console.error("MATCH_NOTIFICATION_EMAIL_FAILED:", error.code || "SMTP_ERROR");
    }
};

const updateMatches = async (item) => {
    const matches = await matchingAlgo(item);
    for (const candidate of matches) {
        const lostItem = item.type === "lost" ? item : candidate.item;
        const foundItem = item.type === "found" ? item : candidate.item;
        const existing = await Match.findOne({
            lostItem: lostItem._id,
            foundItem: foundItem._id
        });

        if (existing) {
            existing.similarity = candidate.score;
            if (existing.status === "closed" && !existing.claimedAt) {
                existing.status = "open";
            }
            await existing.save();
            continue;
        }

        let match;
        try {
            match = await Match.create({
                lostItem: lostItem._id,
                foundItem: foundItem._id,
                similarity: candidate.score
            });
        } catch (error) {
            if (error.code !== 11000) throw error;
            continue;
        }

        const lostOwner = await User.findById(lostItem.postedBy).select("email");
        if (lostOwner?.email) {
            await sendMatchNotification(lostOwner.email, lostItem, foundItem, match);
        }
    }
};

router.route("/")
    .get(wrapAsync(async (req, res) => {
        const query = {};
        if (req.query.type) {
            const type = String(req.query.type).toLowerCase();
            if (!["lost", "found"].includes(type)) {
                return res.status(400).json({ message: "Invalid report type" });
            }
            query.type = type;
            if (type === "found") query.status = "active";
        }

        const Items = await Item.find(query)
            .populate("postedBy", "username")
            .sort({ date: -1 });
        res.json({ Items });
    }))
    .post(isLoggedIn, wrapAsync(async (req, res) => {
        const type = String(req.body.type || "").toLowerCase();
        if (!["lost", "found"].includes(type)) {
            return res.status(400).json({ message: "Type must be Lost or Found" });
        }

        const submittedDate = req.body.date ? new Date(req.body.date) : new Date();
        if (Number.isNaN(submittedDate.getTime())) {
            return res.status(400).json({ message: "Invalid report date" });
        }
        const dateStart = new Date(Date.UTC(
            submittedDate.getUTCFullYear(),
            submittedDate.getUTCMonth(),
            submittedDate.getUTCDate()
        ));
        const dateEnd = new Date(dateStart);
        dateEnd.setUTCDate(dateEnd.getUTCDate() + 1);
        const duplicates = await Item.find({
            postedBy: req.user._id,
            type,
            status: "active",
            category: req.body.category,
            date: { $gte: dateStart, $lt: dateEnd }
        }).select("name color location");
        const isDuplicate = duplicates.some((item) =>
            normalizeText(item.name) === normalizeText(req.body.name) &&
            normalizeText(item.color) === normalizeText(req.body.color) &&
            normalizeText(item.location) === normalizeText(req.body.location)
        );

        if (isDuplicate) {
             return res.status(409).json({
                message: "You have already posted this item for this date."
            });
        }

        const item = await Item.create({
            name: req.body.name,
            description: req.body.description || "",
            category: req.body.category,
            color: req.body.color || "",
            location: req.body.location,
            type,
            date: submittedDate,
            imageUrl: req.file?.path || "",
            postedBy: req.user._id
        });

        await updateMatches(item);

        res.status(201).json({
            message: "Posted Successfully",
            item
        });
    }));

router.get("/mine", isLoggedIn, wrapAsync(async (req, res) => {
    const Items = await Item.find({ postedBy: req.user._id })
        .populate("postedBy", "username")
        .sort({ date: -1 });
    res.json({ Items });
}));

router.get("/myposted/:id", isLoggedIn, wrapAsync(async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: "Invalid item ID" });
    }
    const postedItems = await Item.find({ postedBy: req.user._id })
        .populate("postedBy", "username")
        .sort({ date: -1 });
    res.json({ postedItems });
}));

router.get("/matches/mine", isLoggedIn, wrapAsync(async (req, res) => {
    const itemIds = await Item.find({ postedBy: req.user._id }).distinct("_id");
    const matches = await Match.find({
        $or: [
            { lostItem: { $in: itemIds } },
            { foundItem: { $in: itemIds } }
        ]
    })
        .populate({
            path: "lostItem",
            select: "name description category color location date type status imageUrl postedBy",
            populate: { path: "postedBy", select: "username" }
        })
        .populate({
            path: "foundItem",
            select: "name description category color location date type status imageUrl postedBy",
            populate: { path: "postedBy", select: "username" }
        })
        .populate("claimedBy", "username email")
        .sort({ createdAt: -1 });

    const visibleMatches = matches
        .filter((match) => match.lostItem && match.foundItem)
        .map((match) => {
            const isFinder = String(match.foundItem.postedBy?._id) === String(req.user._id);
            return {
                _id: match._id,
                lostItem: match.lostItem,
                foundItem: match.foundItem,
                similarity: match.similarity,
                status: match.status,
                createdAt: match.createdAt,
                claimant: isFinder && match.claimedBy ? {
                    username: match.claimedBy.username,
                    email: match.claimedBy.email
                } : null
            };
        });

    res.json({ matches: visibleMatches });
}));

router.post("/matches/:id/claim", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        return res.status(400).json({ message: "Invalid match ID" });
    }

    const match = await Match.findById(id)
        .populate({
            path: "lostItem",
            select: "name type status postedBy",
            populate: { path: "postedBy", select: "username" }
        })
        .populate({
            path: "foundItem",
            select: "name type status postedBy",
            populate: { path: "postedBy", select: "username email" }
        });

    if (!match || !match.lostItem || !match.foundItem) {
        return res.status(404).json({ message: "Match not found" });
    }
    if (match.similarity < MATCH_THRESHOLD) {
        return res.status(400).json({ message: "This match is below the claim threshold" });
    }
    if (!match.lostItem.postedBy._id.equals(req.user._id)) {
        return res.status(403).json({ message: "Only the lost report owner can claim this match" });
    }
    if (String(match.foundItem.postedBy._id) === String(req.user._id)) {
        return res.status(403).json({ message: "You cannot claim your own found report" });
    }
    if (match.lostItem.type !== "lost" || match.lostItem.status !== "active" ||
        match.foundItem.type !== "found" || match.foundItem.status !== "active") {
        return res.status(409).json({ message: "Both reports must be active to submit a claim" });
    }
    if (match.status !== "open") {
        return res.status(409).json({ message: "This match has already been claimed or closed" });
    }

    const claimedMatch = await Match.findOneAndUpdate(
        { _id: match._id, status: "open" },
        {
            $set: {
                status: "claimed",
                claimedBy: req.user._id,
                claimedAt: new Date()
            }
        },
        { new: true }
    );
    if (!claimedMatch) {
        return res.status(409).json({ message: "This match has already been claimed or closed" });
    }

    const claimant = await User.findById(req.user._id).select("username email");
    try {
        await sendClaimEmail({
            email: match.foundItem.postedBy.email,
            finderName: match.foundItem.postedBy.username,
            claimantName: claimant.username,
            claimantEmail: claimant.email,
            foundItem: match.foundItem
        });
    } catch (error) {
        console.error("CLAIM_NOTIFICATION_EMAIL_FAILED:", error.code || "SMTP_ERROR");
    }

    res.json({
        message: "Claim submitted. The finder has been notified.",
        match: {
            _id: claimedMatch._id,
            status: claimedMatch.status,
            claimedAt: claimedMatch.claimedAt
        }
    });
}));

router.delete("/delete/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    await Match.deleteMany({
        $or: [
            { lostItem: req.params.id },
            { foundItem: req.params.id }
        ]
    });
    res.json({ message: "Deleted Successfully" });
}));

router.put("/update/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const allowedFields = ["name", "description", "category", "color", "location", "type", "date", "status"];
    const updatedData = {};
    for (const field of allowedFields) {
        if (Object.hasOwn(req.body, field)) updatedData[field] = req.body[field];
    }
    if (updatedData.type !== undefined) {
        updatedData.type = String(updatedData.type).toLowerCase();
        if (!["lost", "found"].includes(updatedData.type)) {
            return res.status(400).json({ message: "Type must be Lost or Found" });
        }
    }
    if (updatedData.status !== undefined && !["active", "resolved"].includes(updatedData.status)) {
        return res.status(400).json({ message: "Invalid report status" });
    }

    const item = await Item.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true
    });
    if (item.status === "resolved") {
        await Match.updateMany(
            {
                $or: [{ lostItem: item._id }, { foundItem: item._id }],
                status: "open"
            },
            { $set: { status: "closed" } }
        );
    } else {
        await updateMatches(item);
    }

    res.json({ message: "Data Updated Successfully", item });
}));

router.get("/:id", wrapAsync(async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: "Invalid item ID" });
    }
    const item = await Item.findById(req.params.id).populate("postedBy", "username");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ item });
}));

module.exports = router;
