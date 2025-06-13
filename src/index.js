const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id:"1a",
        username: "Mind meets Machine",
        content: "We talk about everything on the border where tech fuses with psycology",
        createdAt: "May 14, 2025, 12:15 PM"
    },
    {
        id:"2b",
        username: "Raw Reflections",
        content: "Everyday insights unfiltered and unique",
        createdAt: "May 13, 2025, 6:40 PM"
    },
    {
        id:"3c",
        username: "Inner awakenings",
        content: " The philosophy of it all",
        createdAt: "May 12, 2025, 9:20 AM"
    }
];


app.get("/posts", (req, res) => {
    res.render("index", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new");
});

// FIX: Add id to new posts (so /posts/:id works for them too)
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    // Generate a simple unique id (not robust, but works for demo)
    let id = Math.random().toString(36).substr(2, 4);
    posts.push({ id, username, content });
    res.redirect("/posts");
});

// FIX: Pass the post variable to the template
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("show", { post });
});

// Add these new routes to your existing index.js

// Show edit form
app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("edit", { post });
});

// Update post
app.post("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { username, content } = req.body;
    
    const postIndex = posts.findIndex(p => id === p.id);
    if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }
    
    // Update the post but keep the id
    posts[postIndex] = {
        id: posts[postIndex].id,
        username,
        content
    };
    
    res.redirect("/posts");
});

// Delete post
app.post("/posts/:id/delete", (req, res) => {
    const { id } = req.params;
    posts = posts.filter(post => post.id !== id);
    res.redirect("/posts");
});

app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = Math.random().toString(36).substr(2, 4);
    let createdAt = new Date().toLocaleString("en-IN", { 
        dateStyle: "medium", 
        timeStyle: "short" 
    }); // or just new Date() if you want the raw date
    posts.push({ id, username, content, createdAt });
    res.redirect("/posts");
});


const methodOverride = require('method-override');

// Add this line after your other app.use() statements
app.use(methodOverride('_method'));

// Then change the delete route to:
app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    posts = posts.filter(post => post.id !== id);
    res.redirect("/posts");
});


app.listen(port, () => {
    console.log("listening to port : 8080");
});
