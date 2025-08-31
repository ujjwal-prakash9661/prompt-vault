
const promptModel = require('../models/prompt.model')
const userModel = require('../models/user.model')

async function addFavourite(req, res)
{
    try
    {
        const {promptId} = req.params
        const userId = req.user.id

        const prompt = await promptModel.findById(promptId)

        if(!prompt)
        {
            return res.status(404).json({
                message : "Prompt not found"
            })
        }

        const user = await userModel.findById(userId)

        if(!user)
        {
            return res.status(404).json({
                message : "User not found"
            })
        }

        user.favourites.push(promptId)
        await user.save()

        res.status(200).json({
            message : "Added to favourites",
            favourites: user.favourites
        })
    }

    catch(err)
    {
        console.log(err)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

async function removeFavourite(req, res)
{
    try
    {
        const {promptId} = req.params
        const userId = req.user.id

        const user = await userModel.findById(userId)

        if(!user)
        {
            return res.status(404).json({ message: "User not found" })    
        }

        if(!user.favourites.includes(promptId))
        {
            return res.status(404).json({
                message : "Prompt is not in your favourites"
            })
        }

        user.favourites = user.favourites.filter(fav => fav.toString() !== promptId)
        await user.save()

        res.status(200).json({
            message : "Removed from favourites",
            favourites: user.favourites
        })
    }

    catch(err)
    {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

async function getFavourites(req, res)
{
    try
    {
        const userId = req.user.id
        const user = await userModel.findById(userId).populate('favourites')

        if(!user)
        {
            return res.status(404).json({
                message : "User not found"
            })
        }

        res.status(200).json({
            favourites: user.favourites
        })
    }

    catch(err)
    {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

// Clear all favourites for the current user (does not delete prompts)
async function clearFavourites(req, res) {
    try {
        const userId = req.user.id;
        await userModel.findByIdAndUpdate(userId, { $set: { favourites: [] } });
        return res.status(200).json({ message: 'Favourites cleared' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}

// Minimal new endpoint: return lifetime promptCount only
async function getPromptCount(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const user = await userModel.findById(userId).select('promptCount');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ promptCount: user.promptCount || 0 });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    addFavourite,
    removeFavourite,
    getFavourites,
    clearFavourites,
    getPromptCount
}

