const promptModel = require('../models/prompt.model')

const userModel = require('../models/user.model')

const {validationResult} = require('express-validator')

async function createPrompt(req, res)
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {title, content, tags, category} = req.body

    if(!title || !content)
    {
        return res.status(401).json({
            message : "Title and Content are required"
        })
    }

    const prompt = await promptModel.create({
        title,
        content,
        tags,
        category,
        user : req.user._id
    })

    
    // Safely increment user's promptCount after successful creation
    await userModel.findByIdAndUpdate(req.user._id, {
        $inc: { promptCount: 1 }
    })

    res.status(200).json({
        message : "Prompt added successfully",
        prompt
    })
}

async function getPrompts(req, res)
{
    try
    {
        const prompts = await promptModel.find({user : req.user._id}).sort({ createdAt : 1 })

        res.status(200).json({
            prompts
        })
    }

    catch(err)
    {
        res.status(500).json({message : err.message})
    }
}

async function updatePrompt(req, res)
{
    try
    {
        const {id} = req.params

        const {title, content, tags} = req.body

        const prompt = await promptModel.findOneAndUpdate(
            {_id : id, user : req.user._id},
            {title, content, tags},
            {new : true}
        )

        if(!prompt)
        {
            return res.status(404).json({
                message : "Prompt not found or not Authorized"
            })
        }

        res.status(200).json({
            message : "Prompt updated Successfully",

            prompt
        })
    }

    catch(err)
    {
        res.status(500).json({
            message : err.message
        })
    }
}

async function deletePrompt(req, res)
{
    const {id} = req.params

    const prompt = await promptModel.findOneAndDelete({_id : id, user : req.user._id})

    if(!prompt)
    {
        return res.status(404).json({
            message: "Prompt not found or not authorized"
        })
    }

    res.status(200).json({
        message: "Prompt deleted successfully"
    })
}

async function searchPrompts(req, res)
{
    const {q} = req.query

    if(!q)
    {
        return res.status(400).json({
            message : "Search query missing"
        })
    }

    const prompts = await promptModel.find({
        user : req.user._id,

        $or : [
            {title : { $regex : q, $options : 'i' }},

            {tags : { $regex : q, $options : 'i' }},

            {content : {$regex : q, $options : 'i' }}
        ]   //ye multiple conditions check krne ke liye hai title ya tags jisme check ho jaye chalega
    })

    res.status(200).json(prompts)
}

async function getCategories(req, res) {
    try 
    {
        const prompts = await promptModel.find({ user: req.user._id }).sort({ createdAt: 1 })

        const grouped = new Map()
        for (const p of prompts) 
        {
            const cat = p.category || 'General'
            if(!grouped.has(cat)) grouped.set(cat, [])
            grouped.get(cat).push({ id: p._id, title: p.title, content: p.content })
        }

        const categories = Array.from(grouped.entries()).map(([name, items]) => ({
            name,
            items
        }))

        return res.status(200).json({ categories })
    } 
    catch(err) 
    {
        return res.status(500).json({ message: err.message })
    }
}

async function bulkImport(req, res)
{
    try
    {
        const prompts = req.body.prompts

        if(!Array.isArray(prompts))
        {
            return res.status(400).json({
                message : "Invalid data format"
            })
        }

        await promptModel.insertMany(prompts.map(prompt =>
            ({ ...prompt, user: req.user._id })
        ))

        res.status(200).json({
            message : "Bulk import successful",
            count : prompts.length
        })
    }

    catch(err)
    {
        res.status(500).json({ message: "Error importing prompts", err });
    }
}

// Delete all prompts for current user and remove them from user's favourites
async function deleteAllPrompts(req, res) {
    try {
        const userId = req.user._id;
        const docs = await promptModel.find({ user: userId }).select('_id');
        const ids = docs.map(d => d._id);

        await promptModel.deleteMany({ user: userId });
        if (ids.length) {
            await userModel.findByIdAndUpdate(userId, { $pull: { favourites: { $in: ids } } });
        }

        return res.status(200).json({ message: 'All prompts deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createPrompt,
    getPrompts,
    updatePrompt,
    deletePrompt,
    searchPrompts,
    getCategories,
    bulkImport,
    deleteAllPrompts
}