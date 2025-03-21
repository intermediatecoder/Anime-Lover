require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use("/public", express.static(path.resolve("./public")))
app.use(express.json());

const users = []; // Store users dynamically

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// 🆕 **Sign Up API**
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (users.find((u) => u.username === username)) {
        return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ id: users.length + 1, username, password: hashedPassword });

    res.json({ message: "User registered successfully" });
});

// 🔑 **Login API**
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// Protected UI API
app.get("/ui", authenticateToken, (req, res) => {
    const UI = {
        "header": {
            "logo": "http://localhost:5000/public/temp-logo.png",
            "menu": ["Home", "Movies", "New & Popular", ]
        },
        "sections": [
            {
                "type": "banner",
                "content": [
                    {
                        "id": 1,
                        "title": "Attack on Titan",
                        "image": "https://pbs.twimg.com/media/FIIkzJqVIAIILjp.jpg:large",
                        "description": "In a world where humanity fights for survival...",
                        "genres": ["Action", "Dark Fantasy", "Drama"],
                        "episodes": 89,
                        "status": "Completed",
                        "release_year": 2013,
                        "rating": 9.1,
                        "studio": "Wit Studio / MAPPA"
                    }
                ]
            },
            
            {
                "type": "carousel",
                "title": "Trending Now",
                "items": [
                  {
                    "id": 1,
                    "title": "Demon Slayer",
                    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2STRyuv92DUsl3zjdcpwc0KWLEHWe-oqf8w&s",
                    "description": "Tanjiro Kamado embarks on a journey to avenge his family and cure his sister, Nezuko, who has turned into a demon.",
                    "genres": ["Action", "Adventure"],
                    "episodes": 55,
                    "status": "Ongoing",
                    "release_year": 2019,
                    "rating": 8.7,
                    "trailer": "https://www.youtube.com/watch?v=VQGCKyvzIM4",
                    "studio": "Ufotable",
                    "quote": "No matter how many people you may lose, you have no choice but to go on living.",
                    "streaming_platform": "Crunchyroll",
                    "characters": [
                      {
                        "name": "Tanjiro Kamado",
                        "image": "https://i.imgur.com/validImage.jpg"
                      },
                      {
                        "name": "Nezuko Kamado",
                        "image": "https://i.imgur.com/validImage.jpg"
                      }
                    ]
                  },
                  {
                    "id": 2,
                    "title": "Jujutsu Kaisen",
                    "image": "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Jujutsu_kaisen.jpg/220px-Jujutsu_kaisen.jpg",
                    "description": "Yuji Itadori joins the Jujutsu Sorcerers to battle cursed spirits after swallowing a powerful cursed object.",
                    "genres": ["Supernatural", "Dark Fantasy"],
                    "episodes": 47,
                    "status": "Ongoing",
                    "release_year": 2020,
                    "rating": 8.9,
                    "trailer": "https://www.youtube.com/watch?v=yn9VxUPlC5g",
                    "studio": "MAPPA",
                    "quote": "I don't know how I'll feel when I'm dead, but I don't want to regret the way I lived.",
                    "streaming_platform": "Crunchyroll",
                    "characters": [
                      {
                        "name": "Yuji Itadori",
                        "image": "https://i.imgur.com/validImage.jpg"
                      },
                      {
                        "name": "Satoru Gojo",
                        "image": "https://i.imgur.com/validImage.jpg"
                      }
                    ]
                  },
                  {
                    "id": 3,
                    "title": "One Piece",
                    "image": "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg/220px-One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg",
                    "description": "Monkey D. Luffy and his pirate crew set sail to find the legendary One Piece treasure and become the Pirate King.",
                    "genres": ["Adventure", "Fantasy"],
                    "episodes": "1000+",
                    "status": "Ongoing",
                    "release_year": 1999,
                    "rating": 9.0,
                    "trailer": "https://www.youtube.com/watch?v=8jJJC5R-8Js",
                    "studio": "Toei Animation",
                    "quote": "Power isn't determined by your size, but by the size of your heart and dreams!",
                    "streaming_platform": "Crunchyroll",
                    "characters": [
                      {
                        "name": "Monkey D. Luffy",
                        "image": "https://i.imgur.com/validImage.jpg"
                      },
                      {
                        "name": "Roronoa Zoro",
                        "image": "https://i.imgur.com/validImage.jpg"
                      }
                    ]
                  },
                  {
                    "id": 4,
                    "title": "Naruto Shippuden",
                    "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQLxStja2783Lz8sxOn_RN3sGt02cK6TQC8eGynmfoc3jgsc-K_EeIPwkf5efdVrxir96H8dw",
                    "description": "Naruto Uzumaki continues his journey as a ninja while facing powerful enemies and uncovering hidden truths about his past.",
                    "genres": ["Action", "Martial Arts"],
                    "episodes": 500,
                    "status": "Completed",
                    "release_year": 2007,
                    "rating": 8.6,
                    "trailer": "https://www.youtube.com/watch?v=QspuCt1FM9M",
                    "studio": "Studio Pierrot",
                    "quote": "A lesson without pain is meaningless. That’s because you can’t gain something without sacrificing something in return.",
                    "streaming_platform": "Netflix",
                    "characters": [
                      {
                        "name": "Naruto Uzumaki",
                        "image": "https://i.imgur.com/validImage.jpg"
                      },
                      {
                        "name": "Sasuke Uchiha",
                        "image": "https://i.imgur.com/validImage.jpg"
                      }
                    ]
                  },
                  {
                    "id": 5,
                    "title": "Tokyo Revengers",
                    "image": "https://m.media-amazon.com/images/M/MV5BNGU3YzdhMWEtMGRkMC00MzY2LThkOGEtMDFmZDE0NGQxYzFjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                    "description": "Takemichi Hanagaki travels back in time to save his middle school girlfriend and change the course of his life.",
                    "genres": ["Action", "Time Travel"],
                    "episodes": 37,
                    "status": "Ongoing",
                    "release_year": 2021,
                    "rating": 7.9,
                    "trailer": "https://www.youtube.com/watch?v=5mVnL9bT3VA",
                    "studio": "LIDENFILMS",
                    "quote": "No matter how hard you try, you can’t turn back time. But you can still change the future.",
                    "streaming_platform": "Disney+ Hotstar",
                    "characters": [
                      {
                        "name": "Takemichi Hanagaki",
                        "image": "https://i.imgur.com/validImage.jpg"
                      },
                      {
                        "name": "Mikey (Manjiro Sano)",
                        "image": "https://i.imgur.com/validImage.jpg"
                      }
                    ]
                  }
                ]
              },
                          
            {
                "type": "carousel",
                "title": "Top Picks For You",
                "items": [
                  {
                    "id": 1,
                    "title": "Chainsaw Man",
                    "image": "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Chainsawman.jpg/220px-Chainsawman.jpg",
                    "description": "Denji, a devil hunter, merges with his pet devil, Pochita, to become Chainsaw Man, facing powerful foes in a dark and chaotic world.",
                    "genres": ["Dark Fantasy", "Action"],
                    "episodes": 12,
                    "status": "Ongoing",
                    "release_year": 2022,
                    "rating": 8.6,
                    "trailer": "https://www.youtube.com/watch?v=eyonP1AgC0k",
                    "studio": "MAPPA",
                    "quote": "A normal life... I just wanted a normal life.",
                    "streaming_platform": "Crunchyroll",
                    "characters": [
                      {
                        "name": "Denji",
                        "image": "https://upload.wikimedia.org/wikipedia/en/2/24/Chainsawman.jpg"
                      },
                      {
                        "name": "Makima",
                        "image": "https://i.imgur.com/validImage.jpg"
                      }
                    ]
                  },
                  {
                    "id": 2,
                    "title": "Vinland Saga",
                    "image": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Vinland_Saga_key_visual.png/220px-Vinland_Saga_key_visual.png",
                    "description": "Thorfinn, a young warrior, seeks revenge against his father’s killer while navigating the harsh Viking world filled with battles and betrayals.",
                    "genres": ["Historical", "Action"],
                    "episodes": 48,
                    "status": "Ongoing",
                    "release_year": 2019,
                    "rating": 8.8,
                    "trailer": "https://www.youtube.com/watch?v=fzI9FNjXQ0o",
                    "studio": "Wit Studio",
                    "quote": "You have no enemies. No one has any enemies. There is no one you should hurt.",
                    "streaming_platform": "Netflix",
                    "characters": [
                      {
                        "name": "Thorfinn",
                        "image": "https://upload.wikimedia.org/wikipedia/en/8/8c/Vinland_Saga_key_visual.png"
                      },
                      {
                        "name": "Askeladd",
                        "image": "https://i.imgur.com/validImage.jpg"
                      }
                    ]
                  }
                ]
              },                        
    {
        "type": "carousel",
        "title": "Latest Anime Movies",
        "items": [
            {
                "title": "Suzume",
                "image": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Vinland_Saga_key_visual.png/220px-Vinland_Saga_key_visual.png",
                "genre": "Adventure, Fantasy"
            },
            {
                "title": "Jujutsu Kaisen 0",
                "image": "https://m.media-amazon.com/images/I/81v9J2r71oL.jpg",
                "genre": "Action, Supernatural"
            },
            {
                "title": "Your Name",
                "image": "https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png",
                "genre": "Romance, Fantasy"
            },
            {
                "title": "Weathering with You",
                "image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1573865980i/48614841.jpg",
                "genre": "Drama, Fantasy"
            },
            {
                "title": "Spirited Away",
                "image": "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
                "genre": "Adventure, Fantasy"
            },
            {
                "title": "The Boy and the Heron",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW1T0BjCBRNX58yCs-fXR6C5Oklc3MEkamlw&s",
                "genre": "Drama, Fantasy"
            },
            {
                "title": "A Silent Voice",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbouSPDpN9_LW4wyPYm8hCsnlpRDRByeRsA&s",
                "genre": "Drama, Romance"
            },
            {
                "title": "Howl's Moving Castle",
                "image": "https://upload.wikimedia.org/wikipedia/en/a/a0/Howls-moving-castleposter.jpg",
                "genre": "Fantasy, Adventure"
            },
            {
                "title": "Demon Slayer: Mugen Train",
                "image": "https://m.media-amazon.com/images/I/81RCIT-EpEL._AC_UF1000,1000_QL80_.jpg",
                "genre": "Action, Supernatural"
            },
            {
                "title": "Princess Mononoke",
                "image": "https://m.media-amazon.com/images/I/81Xh5jukUkL._AC_UF1000,1000_QL80_.jpg",
                "genre": "Adventure, Fantasy"
            },
            {
                "title": "My Neighbor Totoro",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnQaIZ7akL_sa4w-8otZuIIr_XQ4D-DeNBvA&s",
                "genre": "Fantasy, Family"
            },
            {
                "title": "The Garden of Words",
                "image": "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10191455_p_v10_af.jpg",
                "genre": "Romance, Drama"
            }
        ]
    },
    
    {
        "type": "carousel",
        "title": "Recommended For You",
        "items": [
            {
                "title": "Death Note",
                "image": "https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg",
                "genre": "Psychological, Thriller"
            },
            {
                "title": "Steins;Gate",
                "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/Steins%3BGate_anime_cover.png/220px-Steins%3BGate_anime_cover.png",
                "genre": "Sci-Fi, Time Travel"
            }
        ]
    }
]

    };

    res.json(UI);
});

// Sample Anime Data
const animeData = {
    anime: [
      {
        id: 1,
        title: "Demon Slayer",
        description: "In a world where humanity fights for survival against giant humanoid creatures, Eren Yeager and his friends uncover dark secrets about their existence.",
        genres: ["Action", "Dark Fantasy", "Drama"],
        episodes: 89,
        status: "Ongoing",
        release_year: 2013,
        rating: 9.1,
        trailer: "https://www.youtube.com/watch?v=MGRm4IzK1SQ",
        studio: "MAPPA",
        quote: "If you win, you live. If you lose, you die. If you don’t fight, you can’t win!",
        streaming_platform: "Crunchyroll",
        characters: [
          {
            name: "Eren Yeager",
            image: "https://i.imgur.com/validImage.jpg"  // Use a placeholder if image is missing
          }
        ]
      }
    ]
  };
  
  
  // ✅ Route to get anime details by ID
  app.get("/api/anime/:id", (req, res) => {
      const anime = animeData.anime.find(a => a.id === parseInt(req.params.id));
      if (anime) {
          res.json(anime);
      } else {
          res.status(404).json({ error: "Anime not found" });
      }
  });
  

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
