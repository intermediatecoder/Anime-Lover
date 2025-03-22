require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use("/public", express.static(path.resolve("./public")));
app.use(express.json());

const users = [];

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

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

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ id: users.length + 1, username, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/ui", authenticateToken, (req, res) => {
  const UI = {
    header: {
      logo: "http://localhost:5000/public/temp-logo.png",
      menu: ["Home", "Movies", "New & Popular"],
    },
    sections: [
      {
        type: "banner",
        content: [
          {
            id: 1,
            title: "Attack on Titan",
            image: "https://pbs.twimg.com/media/FIIkzJqVIAIILjp.jpg:large",
            description: "In a world where humanity fights for survival...",
            genres: ["Action", "Dark Fantasy", "Drama"],
            episodes: 89,
            status: "Completed",
            release_year: 2013,
            rating: 9.1,
            studio: "Wit Studio / MAPPA",
          },
          {
            id: 2,
            title: "Jujutsu Kaisen",
            image: "https://wallpapercave.com/wp/wp13617586.jpg",
            description:
              "Yuji Itadori joins the Jujutsu Sorcerers to battle cursed spirits after swallowing a powerful cursed object.",
            genres: ["Supernatural", "Dark Fantasy"],
            episodes: 47,
            status: "Ongoing",
            release_year: 2020,
            rating: 8.9,
            trailer: "https://www.youtube.com/watch?v=pkKu9hLT-t8",
            studio: "MAPPA",
            quote:
              "I don't know how I'll feel when I'm dead, but I don't want to regret the way I lived.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Yuji Itadori",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUrsszIRIiP6KfFdsPdF9FvyLkHLr9EAe8A&s",
              },
              {
                name: "Satoru Gojo",
                image:
                  "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/07/satoru-gojo-standing.jpg",
              },
            ],
          },
          {
            id: 3,
            title: "One Piece",
            image:
              "https://i.pinimg.com/736x/3a/96/15/3a9615eaea50123e3766ea2439b3a496.jpg",
            description:
              "Monkey D. Luffy and his pirate crew set sail to find the legendary One Piece treasure and become the Pirate King.",
            genres: ["Adventure", "Fantasy"],
            episodes: "1000+",
            status: "Ongoing",
            release_year: 1999,
            rating: 9.0,
            trailer: "https://www.youtube.com/watch?v=8jJJC5R-8Js",
            studio: "Toei Animation",
            quote:
              "Power isn't determined by your size, but by the size of your heart and dreams!",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Monkey D. Luffy",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRJocKNNj32_66KRy3kSakNVk7Phh7pYiXXcfiroKAa4YESJ1mhWQk06hXoiux3EmQgg&usqp=CAU",
              },
              {
                name: "Roronoa Zoro",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxVwUmMZ56zlRHNgllbQxd_BiIkGhXvD5c_w&s",
              },
              {
                name: "Vinsmoke Sanji",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvm3BvF9WGmrcy-w9JYFNhCfL1azThphXiEQ&s",
              },
            ],
          },
          {
            id: 4,
            title: "Death Note",
            image:
              "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c4c70e43-c095-425c-bf98-25c315bef4e1/dhs7iwe-fb7c339d-4dbf-48ad-907f-a3aabedc6f30.png/v1/fill/w_1280,h_427,q_80,strp/death_note_banner_by_zuphillesszie_dhs7iwe-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M0YzcwZTQzLWMwOTUtNDI1Yy1iZjk4LTI1YzMxNWJlZjRlMVwvZGhzN2l3ZS1mYjdjMzM5ZC00ZGJmLTQ4YWQtOTA3Zi1hM2FhYmVkYzZmMzAucG5nIiwiaGVpZ2h0IjoiPD00MjciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS53YXRlcm1hcmsiXSwid21rIjp7InBhdGgiOiJcL3dtXC9jNGM3MGU0My1jMDk1LTQyNWMtYmY5OC0yNWMzMTViZWY0ZTFcL3p1cGhpbGxlc3N6aWUtNC5wbmciLCJvcGFjaXR5Ijo5NSwicHJvcG9ydGlvbnMiOjAuNDUsImdyYXZpdHkiOiJjZW50ZXIifX0.miOxa7nHnBteAptjQMawCJ4hoyNN0-5kklfyiaE9mKY",
            description:
              "A high school student discovers a notebook that grants the power to kill anyone whose name is written in it, leading to a battle of wits.",
            genres: ["Thriller", "Psychological"],
            episodes: 37,
            status: "Completed",
            release_year: 2006,
            rating: 9.0,
            trailer: "https://www.youtube.com/watch?v=NlJZ-YgAt-c",
            studio: "Madhouse",
            quote: "The person whose name is written in this note shall die.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Light Yagami",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQscS9ILpCXgSlGFe08AHnKv5xXwxeVRZWXFA&s",
              },
              {
                name: "L",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAZBDpys1SG8uP4JuoNTDYFKRZ9AA8gpqdQw&s",
              },
              {
                name: "Ryuk",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy_7rYeVg_gsKAo9Z6G8LBHOD66S5tFsLEPQ&s",
              },
            ],
          },
        ],
      },

      {
        type: "carousel",
        title: "Trending Now",
        items: [
          {
            id: 1,
            title: "Demon Slayer",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2STRyuv92DUsl3zjdcpwc0KWLEHWe-oqf8w&s",
            description:
              "Tanjiro Kamado embarks on a journey to avenge his family and cure his sister, Nezuko, who has turned into a demon.",
            genres: ["Action", "Adventure"],
            episodes: 55,
            status: "Ongoing",
            release_year: 2019,
            rating: 8.7,
            trailer: "https://www.youtube.com/watch?v=VQGCKyvzIM4",
            studio: "Ufotable",
            quote:
              "No matter how many people you may lose, you have no choice but to go on living.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Tanjiro Kamado",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuZPngZ581gEne0zPGbOACyUtTH7_0I9a6Tw&s",
              },
              {
                name: "Nezuko Kamado",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwa4LkRI5mQjdnMRYFpohbEEnobhkcak1e2Q&s",
              },
              {
                name: "Zenitsu Agatsuma",
                image:
                  "https://rukminim2.flixcart.com/image/850/1000/kw2fki80/poster/e/9/j/medium-demon-slayer-kimetsu-no-yaiba-zenitsu-agatsuma-anime-boys-original-imag8trahkqgfu93.jpeg?q=90&crop=false",
              },
              {
                name: "Inosuke Hashibira",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROCR4R_veYuXMRpKFuAPjgrBdh--wPQDwJjw&s",
              },
              {
                name: "Kyojuro Rengoku",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIu0q_qSZJ6xrAZ3Q8o1Uk6SL26iLp6GkXg&s",
              },
            ],
          },
          {
            id: 2,
            title: "Jujutsu Kaisen",
            image:
              "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Jujutsu_kaisen.jpg/220px-Jujutsu_kaisen.jpg",
            description:
              "Yuji Itadori joins the Jujutsu Sorcerers to battle cursed spirits after swallowing a powerful cursed object.",
            genres: ["Supernatural", "Dark Fantasy"],
            episodes: 47,
            status: "Ongoing",
            release_year: 2020,
            rating: 8.9,
            trailer: "https://www.youtube.com/watch?v=pkKu9hLT-t8",
            studio: "MAPPA",
            quote:
              "I don't know how I'll feel when I'm dead, but I don't want to regret the way I lived.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Yuji Itadori",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUrsszIRIiP6KfFdsPdF9FvyLkHLr9EAe8A&s",
              },
              {
                name: "Satoru Gojo",
                image:
                  "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/07/satoru-gojo-standing.jpg",
              },
            ],
          },
          {
            id: 3,
            title: "One Piece",
            image:
              "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg/220px-One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg",
            description:
              "Monkey D. Luffy and his pirate crew set sail to find the legendary One Piece treasure and become the Pirate King.",
            genres: ["Adventure", "Fantasy"],
            episodes: "1000+",
            status: "Ongoing",
            release_year: 1999,
            rating: 9.0,
            trailer: "https://www.youtube.com/watch?v=MCb13lbVGE0",
            studio: "Toei Animation",
            quote:
              "Power isn't determined by your size, but by the size of your heart and dreams!",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Monkey D. Luffy",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRJocKNNj32_66KRy3kSakNVk7Phh7pYiXXcfiroKAa4YESJ1mhWQk06hXoiux3EmQgg&usqp=CAU",
              },
              {
                name: "Roronoa Zoro",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxVwUmMZ56zlRHNgllbQxd_BiIkGhXvD5c_w&s",
              },
              {
                name: "Vinsmoke Sanji",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvm3BvF9WGmrcy-w9JYFNhCfL1azThphXiEQ&s",
              },
            ],
          },
          {
            id: 4,
            title: "Naruto Shippuden",
            image:
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQLxStja2783Lz8sxOn_RN3sGt02cK6TQC8eGynmfoc3jgsc-K_EeIPwkf5efdVrxir96H8dw",
            description:
              "Naruto Uzumaki continues his journey as a ninja while facing powerful enemies and uncovering hidden truths about his past.",
            genres: ["Action", "Martial Arts"],
            episodes: 500,
            status: "Completed",
            release_year: 2007,
            rating: 8.6,
            trailer: "https://youtu.be/22R0j8UKRzY?si=jgHWRA2sgGYFqRYX",
            studio: "Studio Pierrot",
            quote:
              "A lesson without pain is meaningless. That’s because you can’t gain something without sacrificing something in return.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Naruto Uzumaki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDt0GCmoCewC0WVxDBtEfhcebrlsp3zojZkw&s",
              },
              {
                name: "Sasuke Uchiha",
                image:
                  "https://preview.redd.it/r3b2ic3lylw61.jpg?auto=webp&s=6b78275917898bdcd7374fb35a122d6e20e62a14",
              },
            ],
          },
          {
            id: 5,
            title: "Tokyo Revengers",
            image:
              "https://m.media-amazon.com/images/M/MV5BNGU3YzdhMWEtMGRkMC00MzY2LThkOGEtMDFmZDE0NGQxYzFjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description:
              "Takemichi Hanagaki travels back in time to save his middle school girlfriend and change the course of his life.",
            genres: ["Action", "Time Travel"],
            episodes: 37,
            status: "Ongoing",
            release_year: 2021,
            rating: 7.9,
            trailer: "https://youtu.be/Pj1yIQYqzKM?si=Plg22wP9cyfnh0Fn",
            studio: "LIDENFILMS",
            quote:
              "No matter how hard you try, you can’t turn back time. But you can still change the future.",
            streaming_platform: "Disney+ Hotstar",
            characters: [
              {
                name: "Takemichi Hanagaki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrNroWvM3HwABatMsCqwqTf1i5aDry_hHIQ&s",
              },
              {
                name: "Mikey (Manjiro Sano)",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwGD1yj8VUA-VacoQRxQthhMPzfLGz9NW_A&s",
              },
            ],
          },
          {
            id: 6,
            title: "Vinland Saga",
            image:
              "https://m.media-amazon.com/images/I/91nhuMimxjL._AC_UF894,1000_QL80_.jpg",
            description:
              "Thorfinn, a young warrior, seeks revenge for his father’s death while navigating the brutal Viking world.",
            genres: ["Action", "Historical"],
            episodes: 48,
            status: "Ongoing",
            release_year: 2019,
            rating: 8.8,
            trailer: "https://youtu.be/f8JrZ7Q_p-8?si=RqdpHMeNqOxJGWsa",
            studio: "Wit Studio",
            quote: "A true warrior needs no sword.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Thorfinn",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx_vFun73L7tpBZ9xlsQyOUkYKTViFJhMF4w&s",
              },
              {
                name: "Askeladd",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYwUVCdrwodQ8ANsHb9RAu0f8GwjqBC6iNdg&s",
              },
            ],
          },
          {
            id: 7,
            title: "Re:Zero - Starting Life in Another World",
            image:
              "https://m.media-amazon.com/images/M/MV5BNTY1M2NjMTItOGFhNi00NDU3LWExNzQtZGY2YWJlYzExNmU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description:
              "Subaru Natsuki is transported to a fantasy world where he gains the power to reset time upon death.",
            genres: ["Fantasy", "Drama"],
            episodes: 50,
            status: "Ongoing",
            release_year: 2016,
            rating: 8.5,
            trailer: "https://youtu.be/Slz_rahWp6Y?si=Z62svYkir35x9LaT",
            studio: "White Fox",
            quote:
              "No one knows what the future holds. That's why its potential is infinite.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Subaru Natsuki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrTQ1Hpx9_nr9q7YxcfNVU9eVVS8n5fUTcDg&s",
              },
              {
                name: "Emilia",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW0VaCeKkagOFg30Y9UHtJtSBKf9Pln6T44w&s",
              },
            ],
          },
          {
            id: 8,
            title: "Erased",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPdbzZIll9L6U2XO2tNLCKLCMdm0v5hrXUA&s",
            description:
              "Satoru Fujinuma, a struggling manga artist, is sent back in time to prevent a series of tragic murders.",
            genres: ["Mystery", "Supernatural"],
            episodes: 12,
            status: "Completed",
            release_year: 2016,
            rating: 8.4,
            trailer: "https://youtu.be/DwmxEAWjTQQ?si=Jmq-5VsE5_8rb5xf",
            studio: "A-1 Pictures",
            quote: "If you don't take risks, you can't create a future!",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Satoru Fujinuma",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3RRQ8NXATchEquqczttEvvnpB3f_qDJJp1w&s",
              },
              {
                name: "Kayo Hinazuki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6JLnCoFS_5VQSyKnAgGjxOxTsbkL-ttJNNQ&s",
              },
            ],
          },
          {
            id: 9,
            title: "Made in Abyss",
            image:
              "https://m.media-amazon.com/images/M/MV5BZjM4ODA5YTktNjliMC00NzI5LTk3ZTctZWYyYWEyNTJhMmQzXkEyXkFqcGc@._V1_.jpg",
            description:
              "A young girl and her robotic companion descend into the Abyss to uncover its secrets and find her mother.",
            genres: ["Adventure", "Fantasy"],
            episodes: 25,
            status: "Ongoing",
            release_year: 2017,
            rating: 8.7,
            trailer: "https://youtu.be/kqBNQEUI8dM?si=1N4ed15i-avFzt8B",
            studio: "Kinema Citrus",
            quote: "The deeper we go, the closer we are to the truth.",
            streaming_platform: "HIDIVE",
            characters: [
              {
                name: "Riko",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz73NmW2aCm-HXFbyq64oEL7sd6qGYZ9H8JA&s",
              },
              {
                name: "Reg",
                image:
                  "https://static.wikia.nocookie.net/madeinabyss/images/4/4e/T_Chara0020.png/revision/latest/scale-to-width/360?cb=20220908175539",
              },
            ],
          },
          {
            id: 10,
            title: "Your Lie in April",
            image:
              "https://m.media-amazon.com/images/M/MV5BZGMyYmFmNzgtMWQ4NS00MWE2LTg4YmEtZGY1MTBiODE0YmE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description:
              "A piano prodigy loses his ability to hear music until a free-spirited violinist changes his life.",
            genres: ["Romance", "Drama"],
            episodes: 22,
            status: "Completed",
            release_year: 2014,
            rating: 8.6,
            trailer: "https://youtu.be/3aL0gDZtFbE?si=0QI8wdsQivM5jQuY",
            studio: "A-1 Pictures",
            quote:
              "Maybe there’s only a dark road up ahead. But you still have to believe and keep going.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Kousei Arima",
                image:
                  "https://i.pinimg.com/736x/ca/bd/98/cabd989902ed818876eb32b1be3dd178.jpg",
              },
              {
                name: "Kaori Miyazono",
                image:
                  "https://preview.redd.it/kaori-miyazono-by-%E5%90%B9%E5%90%B9qy-v0-clh6zdf98jva1.jpg?auto=webp&s=c3524559b95a7288b591e709d5c7887bb3b5fbf4",
              },
            ],
          },
          {
            id: 11,
            title: "Steins Gate",
            image:
              "https://m.media-amazon.com/images/M/MV5BZjI1YjZiMDUtZTI3MC00YTA5LWIzMmMtZmQ0NTZiYWM4NTYwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description:
              "A self-proclaimed mad scientist discovers time travel but soon faces the consequences of altering reality.",
            genres: ["Sci-Fi", "Thriller"],
            episodes: 24,
            status: "Completed",
            release_year: 2011,
            rating: 9.1,
            trailer: "https://youtu.be/uMYhjVwp0Fk?si=lq0jRk8ZvSRIOJHk",
            studio: "White Fox",
            quote:
              "No one knows what the future holds. That’s why its potential is infinite.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Rintarou Okabe",
                image: "https://i.redd.it/xnv1e8gup77a1.jpg",
              },
              {
                name: "Kurisu Makise",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUh9RJbt7ovk4_XYVTejH-FVuED1Pw786Iog&s",
              },
            ],
          },
        ],
      },

      {
        type: "carousel",
        title: "Top Picks For You",
        items: [
          {
            id: 1,
            title: "Chainsaw Man",
            image:
              "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Chainsawman.jpg/220px-Chainsawman.jpg",
            description:
              "Denji, a devil hunter, merges with his pet devil, Pochita, to become Chainsaw Man, facing powerful foes in a dark and chaotic world.",
            genres: ["Dark Fantasy", "Action"],
            episodes: 12,
            status: "Ongoing",
            release_year: 2022,
            rating: 8.6,
            trailer: "https://youtu.be/j9sSzNmB5po?si=ND8vHJQXW7gXYBDh",
            studio: "MAPPA",
            quote: "A normal life... I just wanted a normal life.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Denji",
                image:
                  "https://upload.wikimedia.org/wikipedia/en/2/24/Chainsawman.jpg",
              },
              {
                name: "Makima",
                image:
                  "https://64.media.tumblr.com/ee5d6cd08c990bcb2fbda17625cb03bb/3207201e30a57ef3-43/s1280x1920/cd6bb4d64be192d20f44ff17842f0d70d35cfcc3.png",
              },
            ],
          },
          {
            id: 2,
            title: "Vinland Saga",
            image:
              "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Vinland_Saga_key_visual.png/220px-Vinland_Saga_key_visual.png",
            description:
              "Thorfinn, a young warrior, seeks revenge against his father’s killer while navigating the harsh Viking world filled with battles and betrayals.",
            genres: ["Historical", "Action"],
            episodes: 48,
            status: "Ongoing",
            release_year: 2019,
            rating: 8.8,
            trailer: "https://youtu.be/pahdCwHJjaU?si=hUI9JUu24MGiHoUe",
            studio: "Wit Studio",
            quote:
              "You have no enemies. No one has any enemies. There is no one you should hurt.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Thorfinn",
                image:
                  "https://upload.wikimedia.org/wikipedia/en/8/8c/Vinland_Saga_key_visual.png",
              },
              {
                name: "Askeladd",
                image: "https://images.alphacoders.com/120/1206809.jpg",
              },
            ],
          },
          {
            id: 3,
            title: "One Punch Man",
            image:
              "https://upload.wikimedia.org/wikipedia/en/c/c3/OnePunchMan_manga_cover.png",
            description:
              "Saitama, a hero who can defeat any opponent with a single punch, struggles with the boredom of his overwhelming power.",
            genres: ["Action", "Comedy"],
            episodes: 24,
            status: "Ongoing",
            release_year: 2015,
            rating: 8.7,
            trailer: "https://youtu.be/C0M93res8Z0?si=1PDW0P1p6yUALino",
            studio: "Madhouse",
            quote: "I'm just a guy who's a hero for fun.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Saitama",
                image:
                  "https://rukminim2.flixcart.com/image/850/1000/kuof5ow0/wall-decoration/j/k/b/saitama-one-punch-man-anime-gloves-wallpaper-1-p276-poster-smoky-original-imag7qxqa2bs5gyb.jpeg?q=90&crop=false",
              },
              {
                name: "Genos",
                image:
                  " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHmsQ1AItP45RDDuvotnT8qHmu8wH-DlYEIg&s",
              },
            ],
          },
          {
            id: 4,
            title: "Tokyo Revengers",
            image:
              "https://m.media-amazon.com/images/M/MV5BNGU3YzdhMWEtMGRkMC00MzY2LThkOGEtMDFmZDE0NGQxYzFjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description:
              "Takemichi Hanagaki travels back in time to prevent his ex-girlfriend’s tragic fate and change the future of a dangerous gang.",
            genres: ["Action", "Drama"],
            episodes: 37,
            status: "Ongoing",
            release_year: 2021,
            rating: 8.3,
            trailer: "https://youtu.be/Fwyc8XhXVSA?si=3mh6GxW5m2KSfyYx",
            studio: "Liden Films",
            quote: "I’ll change the future, no matter what it takes!",
            streaming_platform: "Disney+",
            characters: [
              {
                name: "Takemichi Hanagaki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrNroWvM3HwABatMsCqwqTf1i5aDry_hHIQ&s",
              },
              {
                name: "Mikey (Manjiro Sano)",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwGD1yj8VUA-VacoQRxQthhMPzfLGz9NW_A&s",
              },
            ],
          },
          {
            id: 5,
            title: "Noragami",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyJ0KEGfD-ukgdb6-fnXE0hzDvHIU9QcuLaA&s",
            description:
              "A minor god, Yato, takes odd jobs to build his reputation while forming bonds with a human girl and a wandering spirit.",
            genres: ["Action", "Supernatural"],
            episodes: 25,
            status: "Ongoing",
            release_year: 2014,
            rating: 8.2,
            trailer: "https://youtu.be/IQnnwUXd_0U?si=M9VHXs0UoW72QQV4",
            studio: "Bones",
            quote:
              "Even if things are painful and tough, people should appreciate what it means to be alive.",
            streaming_platform: "Funimation",
            characters: [
              {
                name: "Yato",
                image:
                  "https://cdn.myanimelist.net/r/200x268/images/characters/3/328158.jpg?s=a6e211302d2d6119add88247967a0dec",
              },
              {
                name: "Hiyori Iki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPg-RN8OQT2eQBlzsHdmSRotQ_asorLmR_BA&s",
              },
              {
                name: "Yukine",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEn93VVRKM5Fs7_bB3Zrg6wu-xPcsF6mZvvg&s",
              },
            ],
          },
          {
            id: 6,
            title: "Death Note",
            image:
              "https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg",
            description:
              "A high school student discovers a notebook that grants the power to kill anyone whose name is written in it, leading to a battle of wits.",
            genres: ["Thriller", "Psychological"],
            episodes: 37,
            status: "Completed",
            release_year: 2006,
            rating: 9.0,
            trailer: "https://youtu.be/NlJZ-YgAt-c?si=_qMO7rVMLEz-U-MC",
            studio: "Madhouse",
            quote: "The person whose name is written in this note shall die.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Light Yagami",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQscS9ILpCXgSlGFe08AHnKv5xXwxeVRZWXFA&s",
              },
              {
                name: "L",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAZBDpys1SG8uP4JuoNTDYFKRZ9AA8gpqdQw&s",
              },
              {
                name: "Ryuk",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy_7rYeVg_gsKAo9Z6G8LBHOD66S5tFsLEPQ&s",
              },
            ],
          },
          {
            id: 7,
            title: "Mob Psycho 100",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_2rgY5FQqUBWGLwShnH_yLPbOePo5YxynIg&s",
            description:
              "Shigeo 'Mob' Kageyama, a powerful psychic, tries to live a normal life while keeping his emotions and abilities in check.",
            genres: ["Action", "Supernatural"],
            episodes: 37,
            status: "Completed",
            release_year: 2016,
            rating: 8.6,
            trailer: "https://youtu.be/fAwGv0AJ7UI?si=WfF6ELj1Lkt3u_hm",
            studio: "Bones",
            quote:
              "It's not that I don't have emotions. I'm just bad at expressing them.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Shigeo Kageyama",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeXmMnKUTy7DvexjvJ9N-MKZXlw8H2RbVOvg&s",
              },
              {
                name: "Reigen Arataka",
                "image ":
                  " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGRdsLoHWlxVbaqBFU-5Fqw4E871-0vX9LDQ&s",
              },
            ],
          },
          {
            id: 8,
            title: "Blue Lock",
            image:
              "https://m.media-amazon.com/images/M/MV5BNWFlNmJkN2YtNGRiZS00NjExLTlmNmEtYzdiMTdiZmMzYzAwXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
            description:
              "Japan's quest for a world-class striker leads to an intense survival competition among young football players in Blue Lock.",
            genres: ["Sports", "Thriller"],
            episodes: 24,
            status: "Ongoing",
            release_year: 2022,
            rating: 8.4,
            trailer: "https://youtu.be/hTfnf4y-sgQ?si=BnzzctfmporKvLD_",
            studio: "8bit",
            quote:
              "Only the strongest egoist can become the best striker in the world!",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Yoichi Isagi",
                image:
                  "https://cdn.myanimelist.net/r/200x268/images/characters/6/558080.jpg?s=ec6bc722a6f39f0fbd33f256c755608f",
              },
              {
                name: "Rin Itoshi",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5EVsGvErbyg4rR6GupA_hAcu3Vbd4ezE27Q&s",
              },
              {
                name: "Jinpachi Ego",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-_asoVikWdEfLVn9jn4jSWpIYfx9pRluBIg&s",
              },
            ],
          },
          {
            id: 9,
            title: "Mushoku Tensei: Jobless Reincarnation",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_aRlQ6pJN4qTBVvaRF9ph2-yF9IlLfJMYMg&s",
            description:
              "A jobless man reincarnates into a fantasy world as Rudeus Greyrat and embarks on a journey of magic, adventure, and self-improvement.",
            genres: ["Isekai", "Fantasy"],
            episodes: 36,
            status: "Ongoing",
            release_year: 2021,
            rating: 8.7,
            trailer: "https://youtu.be/zdXWLmYkekU?si=-FHR8uTgmGv0eE1m",
            studio: "Studio Bind",
            quote: "I will live this life to the fullest without regrets.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Rudeus Greyrat",
                image:
                  " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGjHY7Fv5YlfVSQyUzKFwOeM__yb3fO35czw&s",
              },
              {
                name: "Eris Boreas Greyrat",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJz7vCeyFOKoXu7xayaV6kNqz7X6fM8iSnSQ&s",
              },
              {
                name: "Roxy Migurdia",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYuT6m8rHMIWTjcsUbd2DMdX069pnDa6z8Xw&s",
              },
            ],
          },
          {
            id: 10,
            title: "Black Clover",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1hSDy685CLfoMuD7N02HIfngif8K8rQAoqA&s",
            description:
              "Asta, a boy born without magic in a world where magic is everything, dreams of becoming the Wizard King.",
            genres: ["Action", "Fantasy"],
            episodes: 170,
            status: "Completed",
            release_year: 2017,
            rating: 8.0,
            trailer: "https://youtu.be/PrgxJ1_sUcs?si=5jMOtfhD3fhIMzEw",
            studio: "Studio Pierrot",
            quote: "Surpass your limits. Right here, right now!",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Asta",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZNWEOld4OnKeMLcUFOFU2UCeGkm_EaeWyw&s",
              },
              {
                name: "Yuno",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTERMeY85ICJdv_iLuMdN643qkY4RhhH67faQ&s",
              },
              {
                name: "Noelle Silva",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZEsu0SxcXgm5bgw9sksno6YLglg4OazOF1A&s",
              },
            ],
          },
        ],
      },
      {
        type: "carousel",
        title: "Latest Anime Movies",
        items: [
          {
            id: 1,
            title: "Suzume",
            image:
              "https://i0.wp.com/stewarthotston.com/wp-content/uploads/2024/10/images.jpeg?fit=452%2C678&ssl=1",
            description:
              "A young girl embarks on a journey to close mysterious doors that cause disasters across Japan.",
            genres: ["Adventure", "Fantasy"],
            release_year: 2022,
            rating: 8.2,
            episodes: 1,
            status: "Completed",
            trailer: "https://youtu.be/5pTcio2hTSw?si=4qtG9lzdObryvuSa",
            studio: "CoMix Wave Films",
            quote: "The world is full of doors waiting to be opened.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Suzume Iwato",
                image:
                  "https://s4.anilist.co/file/anilistcdn/character/large/b259510-59wuAsKvY2wW.png",
              },
              {
                name: "Souta Munakata",
                image:
                  "https://s4.anilist.co/file/anilistcdn/character/large/b284260-lXeBzrA6ZchP.png",
              },
            ],
          },
          {
            id: 2,
            title: "Jujutsu Kaisen 0",
            image:
              "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Jujutsu_kaisen.jpg/220px-Jujutsu_kaisen.jpg",
            description:
              "Yuta Okkotsu joins Tokyo Jujutsu High to learn how to control his cursed spirit, Rika.",
            genres: ["Action", "Supernatural"],
            release_year: 2021,
            rating: 8.5,
            episodes: 1,
            status: "Completed",
            trailer: "https://youtu.be/2docezZl574?si=xohp2omKdGnt93-2",
            studio: "MAPPA",
            quote: "I promise I'll break your curse.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Yuji Itadori",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUrsszIRIiP6KfFdsPdF9FvyLkHLr9EAe8A&s",
              },
              {
                name: "Satoru Gojo",
                image:
                  "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/07/satoru-gojo-standing.jpg",
              },
            ],
          },
          {
            id: 3,
            title: "Your Name",
            image:
              "https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png",
            description:
              "Two strangers mysteriously swap bodies and must find each other across time and space.",
            genres: ["Romance", "Fantasy"],
            release_year: 2016,
            rating: 8.9,
            episodes: 1,
            status: "Completed",
            trailer: "https://youtu.be/xU47nhruN-Q?si=R715Q8y27lEAc2rL",
            studio: "CoMix Wave Films",
            quote:
              "I felt like I was searching for someone, searching for something.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Taki Tachibana",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA7iXjlpLQj3T5zxpGRunnBnPUXZiBtnsKPw&s",
              },
              {
                name: "Mitsuha Miyamizu",
                image:
                  "https://www.manga-jam.com/wp-content/uploads/2016/11/How_Draw_Mitsuha-Miyamizu_Kimi_No_Na_Wa.jpg",
              },
            ],
          },
          {
            id: 4,
            title: "Weathering with You",
            image:
              "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1573865980i/48614841.jpg",
            description:
              "A runaway boy meets a girl with the ability to control the weather, changing both their lives forever.",
            genres: ["Drama", "Fantasy"],
            release_year: 2019,
            rating: 8.3,
            episodes: 1,
            status: "Completed",
            trailer: "https://youtu.be/Q6iK6DjV_iE?si=SyFSe8WQnznTnwNG",
            studio: "CoMix Wave Films",
            quote:
              "Who cares if we can’t see the sun shining? I want you more than any blue sky.",
            streaming_platform: "Amazon Prime",
            characters: [
              {
                name: "Hodaka Morishima",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtbwnx7Mh18DGZgiwI6x-Oo4tln3Ib_NAhmw&s",
              },
              {
                name: "Hina Amano",
                image: "https://i.redd.it/ehy9ikmw7m651.jpg",
              },
            ],
          },
          {
            id: 5,
            title: "Spirited Away",
            image:
              "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
            description:
              "A young girl wanders into a mysterious world of spirits and must work to save her parents.",
            genres: ["Adventure", "Fantasy"],
            release_year: 2001,
            rating: 8.6,
            episodes: 1,
            status: "Completed",
            trailer: "https://youtu.be/ByXuk9QqQkk?si=aaeTB2fryeb1Dlqu",
            studio: "Studio Ghibli",
            quote: "Once you've met someone, you never really forget them.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Chihiro Ogino",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCwL3gxkh7vFCLxhCufQ5uPyr-SUelibi6SA&s",
              },
              {
                name: "Haku",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcqBOjk9oKJVOzoXu5bnIKxp8PkkgBxu5hsg&s",
              },
            ],
          },
          {
            id: 6,
            title: "Ex-Arm",
            image:
              "https://m.media-amazon.com/images/I/71zzoLc9LFL._AC_UF1000,1000_QL80_.jpg",
            description:
              "A sci-fi series with notoriously poor animation and storytelling.",
            genres: ["Sci-Fi", "Action"],
            episodes: 12,
            status: "Completed",
            release_year: 2021,
            rating: 3.2,
            trailer: "https://youtu.be/0jCPQe9g-TE?si=NRmOHLjalFh64Amt",
            studio: "Visual Flight",
            quote: "Technology without heart is doomed to fail.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Akira Natsume",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqCNdBze-8tOCyhfDxBitFFRnfjOl-pDp_lQ&s",
              },
              {
                name: "Minami Uezono",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKQhfMoWWRfaMD_3dq4R_ytR5c5aZSUNbMJw&s",
              },
            ],
          },
          {
            id: 7,
            title: "Pupa",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYaoRPiuKFqKoLcjloAZf8a2DZuIY_ejVTbw&s",
            description:
              "A horror anime with disturbingly short episodes and confusing plot.",
            genres: ["Horror", "Psychological"],
            episodes: 12,
            status: "Completed",
            release_year: 2014,
            rating: 3.6,
            trailer: "https://youtu.be/qH5h4z9pmU0?si=LXHjP_vJiK_6Azn4",
            studio: "Studio Deen",
            quote: "Love can be terrifying when twisted.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Utsutsu Hasegawa",
                image:
                  "https://cdn.myanimelist.net/r/200x268/images/characters/9/242295.jpg?s=05f088268349a75c1a30af8381ceaa44",
              },
              {
                name: "Yume Hasegawa",
                image:
                  "https://static.wikia.nocookie.net/villains/images/1/16/236677.jpg/revision/latest/thumbnail/width/360/height/450?cb=20150221230327",
              },
            ],
          },
          {
            id: 8,
            title: "Mars of Destruction",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQccm7jP2Tk__Fxb6STCVRI66ziopVsC8jCXg&s",
            description:
              "Infamously bad anime with poor animation and nonsensical story.",
            genres: ["Sci-Fi", "Action"],
            episodes: 1,
            status: "Completed",
            release_year: 2005,
            rating: 2.1,
            trailer: "https://youtu.be/I1XWjA2Pn60?si=1iJd2AUChyDSMhZs",
            studio: "Idea Factory",
            quote: "Humanity’s last hope... or just a disaster?",
            streaming_platform: "None",
            characters: [
              {
                name: "Takeru Hinata",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Ph2BcYU-QkoA4-B3OzFtQb_9qiptqjjR5g&s",
              },
              { name: "Mikako Aiba" },
            ],
          },
          {
            id: 9,
            title: "Hand Shakers",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlG0fQBu3H0dFetInLxRXFFGMR0Q6_cu_Qkg&s",
            description:
              "Confusing story with overwhelming and disorienting animation.",
            genres: ["Action", "Fantasy"],
            episodes: 12,
            status: "Completed",
            release_year: 2017,
            rating: 4.5,
            trailer: "https://youtu.be/DPIl9VBfSLw?si=L-WuGZYVYEu2POqL",
            studio: "GoHands",
            quote: "The power to connect can also divide.",
            streaming_platform: "Funimation",
            characters: [
              {
                name: "Tazuna Takatsuki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0s3odwYJpaKkjqTot2l4Hic9_-Hr-w64ow&s",
              },
              {
                name: "Koyori Akutagawa",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR59TB8oFUfpmANJ4A0ssS80Gehi8y6Bks4Aw&s",
              },
            ],
          },
          {
            id: 10,
            title: "Taboo Tattoo",
            image:
              "https://m.media-amazon.com/images/M/MV5BYTU0ZjlmZTctYTk2YS00OTUwLTljODAtMGQ1NjA3ODI4YzU5XkEyXkFqcGc@._V1_.jpg",
            description:
              "A cliché battle anime with weak characters and underwhelming execution.",
            genres: ["Action", "Supernatural"],
            episodes: 12,
            status: "Completed",
            release_year: 2016,
            rating: 5.1,
            trailer: "https://youtu.be/WBX1IETSwC0?si=R5Iy5SQLbk7ynwnG",
            studio: "J.C. Staff",
            quote: "Power alone does not determine fate.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Seigi Akatsuka",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiAp_9kKyW_lhdPGbbYMnJqiDDzCwWDiR5AA&s",
              },
              {
                name: "Izzy",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9dv5ajUhRyf3jO4hWTf4_YTREnaN8VZ5oA&s",
              },
            ],
          },
        ],
      },
      {
        type: "carousel",
        title: "Recommended For You",
        items: [
          {
            id: 1,
            title: "Death Note",
            image:
              "https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg",
            description:
              "A high school student discovers a notebook that grants the power to kill anyone whose name is written in it, leading to a battle of wits.",
            genres: ["Thriller", "Psychological"],
            episodes: 37,
            status: "Completed",
            release_year: 2006,
            rating: 9.0,
            trailer: "https://youtu.be/NlJZ-YgAt-c?si=_qMO7rVMLEz-U-MC",
            studio: "Madhouse",
            quote: "The person whose name is written in this note shall die.",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Light Yagami",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQscS9ILpCXgSlGFe08AHnKv5xXwxeVRZWXFA&s",
              },
              {
                name: "L",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAZBDpys1SG8uP4JuoNTDYFKRZ9AA8gpqdQw&s",
              },
              {
                name: "Ryuk",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy_7rYeVg_gsKAo9Z6G8LBHOD66S5tFsLEPQ&s",
              },
            ],
          },
          {
            id: 2,
            title: "Steins Gate",
            image:
              "https://upload.wikimedia.org/wikipedia/en/c/ca/Steins%3BGate_anime_cover.png",
            description:
              "A self-proclaimed scientist discovers time travel and gets entangled in a dangerous conspiracy.",
            genres: ["Sci-Fi", "Time Travel"],
            episodes: 24,
            status: "Completed",
            release_year: 2011,
            rating: 9.1,
            trailer: "https://youtu.be/uMYhjVwp0Fk?si=n8nkFhdKhYQ8GNDO",
            studio: "White Fox",
            quote:
              "No one knows what the future holds. That’s why its potential is infinite.",
            streaming_platform: "Crunchyroll",
            characters: [
              {
                name: "Rintarou Okabe",
                image: "https://i.imgur.com/validImage.jpg",
              },
              {
                name: "Kurisu Makise",
                image: "https://i.imgur.com/validImage.jpg",
              },
            ],
          },
          {
            id: 3,
            title: "Pokemon",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt06ZIQv4rIszdKf1SczX8YyEcNUvlI4oWeg&s",
            description:
              "Ash Ketchum travels the world with his Pokémon to become a Pokémon Master.",
            genres: ["Adventure", "Fantasy"],
            episodes: 1200,
            status: "Ongoing",
            release_year: 1997,
            rating: 7.5,
            trailer: "https://youtu.be/CpwGKewCVro?si=4Xf0Vpe04hIe1ryS",
            studio: "OLM",
            quote: "I wanna be the very best, like no one ever was!",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Ash Ketchum",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8KU_9iMrqGwaDL0SpI_GzdnYaa8l7lYps_g&s",
              },
              {
                name: "Pikachu",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzY8za-44RX4aj6RfGPH_nggoKW2ppnIewgQ&s",
              },
              {
                name: "Misty",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfRVOCfHLVCoOz2qk_W3SPFmRBRPzWnukGSA&s",
              },
              {
                name: "Brock",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGPabXAu8HTNIbtttUW1Q41M_c-ULwwC3GHw&s",
              },
              {
                name: "Team Rocket",
                image:
                  "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Team_Rocket_trio.png/220px-Team_Rocket_trio.png",
              },
            ],
          },
          {
            id: 4,
            title: "Idaten Jump",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6wED-0dx2J17C7D5NwNCCiofQOQotMwVibQ&s",
            description:
              "Sho Yamato and his friends enter a mysterious world where they must win MTB battles to return home.",
            genres: ["Sports", "Adventure"],
            episodes: 52,
            status: "Completed",
            release_year: 2005,
            rating: 7.0,
            trailer: "https://youtu.be/wbi50Cn2UOc?si=F4J4R7LESAAkcj2y",
            studio: "Trans Arts",
            quote: "To win, you must push your limits!",
            streaming_platform: "YouTube",
            characters: [
              {
                name: "Sho Yamato",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRnFsAUvBo-m9QkfGMmYpc0tOzQce3DSJx-Q&s",
              },
              {
                name: "Makoto Shido",
                image:
                  "https://static.wikia.nocookie.net/idatenjump/images/f/ff/Official_makoto.jpg/revision/latest?cb=20111220055409",
              },
              {
                name: "Kyoichi Shido",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS2AgRMY8P-uEoJxT3hfaQrTV_rgLwjpDoTA&s",
              },
              {
                name: "Gabu Samejima",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1qVpolQLFSX5av44TJkiZ1uaVkVeSry-1dQ&s",
              },
            ],
          },
          {
            id: 5,
            title: "Ninja Hattori",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHsTZqLcIko8HxkyECPZIj6SCcLYBv2H0QiA&s",
            description:
              "A little ninja, Hattori, helps Kenichi solve daily life problems with his ninja skills.",
            genres: ["Comedy", "Adventure"],
            episodes: 694,
            status: "Ongoing",
            release_year: 1981,
            rating: 7.3,
            trailer: "https://youtu.be/huc9PY5LHuE?si=-p99J5KLoQOfa4hR",
            studio: "Shin-Ei Animation",
            quote: "Nin nin!",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Hattori Kanzo",
                image:
                  "https://i.pinimg.com/736x/f2/f3/08/f2f308be011eef560491b2c0f5d727d5.jpg",
              },
              {
                name: "Shinzo Hattori",
                image:
                  "https://rukminim2.flixcart.com/image/850/1000/l44hyfk0/poster/a/z/p/large-ninja-hattori-big-size-flex-poster-for-room-md-4295-24x36-original-imagf3j7sgfhffwq.jpeg?q=20&crop=false",
              },
            ],
          },
          {
            id: 6,
            title: "Shin Chan",
            image:
              "https://m.media-amazon.com/images/M/MV5BOWMxNzFjNDItNDMzNC00YTY5LWE1M2UtNDUzMTY4OGNjYzdiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description:
              "A mischievous five-year-old, Shin Chan, creates chaos with his witty remarks and funny antics.",
            genres: ["Comedy", "Slice of Life"],
            episodes: "1000+",
            status: "Ongoing",
            release_year: 1992,
            rating: 8.2,
            trailer: "https://youtu.be/aGCfp_IVd9M?si=KheJxKYUrZoqOg2U",
            studio: "Shin-Ei Animation",
            quote: "I love Chocobi!",
            streaming_platform: "Disney+ Hotstar",
            characters: [
              {
                name: "Shinnosuke Nohara",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkRUnsSiFwAch-ek2Mwwwge1NijNFsH7yT6Q&s",
              },
              {
                name: "Hiroshi Nohara",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVNqJvQrRGrBFm-Gg2hhBi0GHAeiao9haGgw&s",
              },
              {
                name: "Misae Nohara",
                image:
                  "https://static.wikia.nocookie.net/crayonshinchan/images/b/bc/DK-15.jpg/revision/latest/thumbnail/width/360/height/360?cb=20120821091135",
              },
            ],
          },
          {
            id: 7,
            title: "Doraemon",
            image:
              "https://i.pinimg.com/736x/54/7a/7f/547a7f9693b6ab79efcd963d2d760fcf.jpg",
            description:
              "A robotic cat from the future, Doraemon, helps Nobita with futuristic gadgets.",
            genres: ["Sci-Fi", "Comedy"],
            episodes: "3000+",
            status: "Ongoing",
            release_year: 1979,
            rating: 8.5,
            trailer: "https://youtu.be/bNd5xfqVw1M?si=KUMD4Xrj3sxaeVDg",
            studio: "Shin-Ei Animation",
            quote: "Nobita, you need to study!",
            streaming_platform: "Disney+ Hotstar",
            characters: [
              {
                name: "Doraemon",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReMYRm3PBgmPQk52B2nGNLNyeqVahyhdDcGA&s",
              },
              {
                name: "Nobita Nobi",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGJ9V3ttsxNZoqIqHqgKlNOYecuo0Skoh0ew&s",
              },
              {
                name: "Shizuka Minamoto",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvrBR0QoggKXVfG04v2-Jv44Kflopof2j4_A&s",
              },
              {
                name: "Takeshi 'Gian' Goda",
                image:
                  "https://static.wikia.nocookie.net/p__/images/7/7f/Takeshi_Goda_Gian_2005.jpg/revision/latest?cb=20180225225643&path-prefix=protagonist",
              },
              {
                name: "Suneo Honekawa",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ21xFY0mllfGwb2ZQ-hT1kNX5oIEEFsd_9sQ&s",
              },
            ],
          },
          {
            id: 8,
            title: "Kiteretsu Daihyakka",
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX0brejNT_ynZWGRzdpojj7EZQtYaK2psCGA&s",
            description:
              "A boy genius, Kiteretsu, invents gadgets with his robot friend Korosuke.",
            genres: ["Sci-Fi", "Comedy"],
            episodes: 331,
            status: "Completed",
            release_year: 1988,
            rating: 7.1,
            trailer: "https://youtu.be/2HfcfXLTB-k?si=FO2_FFNtWzYp2OBS",
            studio: "Gallop",
            quote: "Science makes life easier!",
            streaming_platform: "YouTube",
            characters: [
              {
                name: "Kiteretsu",
                image:
                  "https://upload.wikimedia.org/wikipedia/bn/4/49/%E0%A6%95%E0%A6%BF%E0%A6%A4%E0%A7%87%E0%A6%B0%E0%A7%87%E0%A7%8E%E0%A6%B8%E0%A7%81.jpg",
              },
              {
                name: "Korosuke",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_tE4kz8rYo9m9f6kAU04eEQz8YoCWNNINJg&s",
              },
            ],
          },
          {
            id: 9,
            title: "Chhota Bheem",
            image:
              "https://m.media-amazon.com/images/M/MV5BMjFhNzU4NmItOTczMC00YTMyLTkzZjgtNTJjZDA0YmRkZTc4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description:
              "A brave young boy, Bheem, protects Dholakpur from villains using his strength and intelligence.",
            genres: ["Action", "Adventure"],
            episodes: 312,
            status: "Ongoing",
            release_year: 2008,
            rating: 6.5,
            trailer: "https://youtu.be/riA607lUuoY?si=mkWY4UiBn4mJbigP",
            studio: "Green Gold Animation",
            quote: "Laddoo gives me power!",
            streaming_platform: "Netflix",
            characters: [
              {
                name: "Bheem",
                image:
                  "https://static.wikia.nocookie.net/chhotabheem/images/7/7e/Placeholder.jpeg/revision/latest?cb=20211108091929",
              },
              {
                name: "Chutki",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiFfm745dA9kgdPPfVKSdQsD-HtkUr9eQvuQ&s",
              },
              {
                name: "Raju",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3QHy_fpmBjUgeTv1J51AGizrYh3I4kLsi8Q&s",
              },
              {
                name: "Kalia",
                image:
                  "https://static.wikia.nocookie.net/chhotabheem/images/d/d8/Kalia.png/revision/latest/thumbnail/width/360/height/360?cb=20210307113909",
              },
            ],
          },
        ],
      },
    ],
  };

  res.json(UI);
});

// Sample Anime Data
const animeData = {
  anime: [
    {
      id: 1,
      title: "Demon Slayer",
      description:
        "In a world where humanity fights for survival against giant humanoid creatures, Eren Yeager and his friends uncover dark secrets about their existence.",
      genres: ["Action", "Dark Fantasy", "Drama"],
      episodes: 89,
      status: "Ongoing",
      release_year: 2013,
      rating: 9.1,
      trailer: "https://www.youtube.com/watch?v=MGRm4IzK1SQ",
      studio: "MAPPA",
      quote:
        "If you win, you live. If you lose, you die. If you don’t fight, you can’t win!",
      streaming_platform: "Crunchyroll",
      characters: [
        {
          name: "Eren Yeager",
          image: "https://i.imgur.com/validImage.jpg", // Use a placeholder if image is missing
        },
      ],
    },
  ],
};

app.get("/api/anime/:id", (req, res) => {
  const anime = animeData.anime.find((a) => a.id === parseInt(req.params.id));
  if (anime) {
    res.json(anime);
  } else {
    res.status(404).json({ error: "Anime not found" });
  }
});
app.get("/news-popular", (req, res) => {
  res.json({
    articles: [
      {
        title: "Attack on Titan Finale Announced",
        description: "The final episode is set to release next month.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr1TokkiwXj4RczK3dSaLI4FDNmstt2sWG1w&s",
      },
      {
        title: "Jujutsu Kaisen Season 3 Confirmed!",
        description: "MAPPA has confirmed the production of JJK Season 3.",
        image:
          "https://upload.wikimedia.org/wikipedia/en/4/46/Jujutsu_kaisen.jpg",
      },
      {
        title: "One Piece Breaks Record",
        description: "One Piece surpasses all-time anime viewership records.",
        image:
          "https://m.media-amazon.com/images/M/MV5BNTcyNDE2YmQtOTU0Yi00ZGNhLWI1MGItZjYyOGQxZTY3M2Y2XkEyXkFqcGc@._V1_QL75_UY281_CR1,0,500,281_.jpg",
      },
      {
        title: "Demon Slayer: Hashira Training Arc Announced",
        description: "The next arc of Demon Slayer is officially confirmed!",
        image:
          "https://a.storyblok.com/f/178900/1200x566/8020019d4e/demon-slayer-hashira-training-world-tour-key-visual.jpg/m/1200x0/filters:quality(95)format(webp)",
      },
      {
        title: "Chainsaw Man Part 2 Manga Gains Huge Popularity",
        description:
          "Tatsuki Fujimoto's Chainsaw Man Part 2 continues to trend worldwide.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwC8Cl2bP6j-nO0ovJsHDKBG7l_4SeoWRduA&s",
      },
      {
        title: "Naruto Remastered HD Episodes Coming Soon",
        description:
          "Naruto's classic episodes are getting a high-quality remaster.",
        image:
          "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
      },
      {
        title: "Spy x Family Movie in Production!",
        description: "A Spy x Family movie is confirmed for a 2025 release.",
        image:
          "https://soranews24.com/wp-content/uploads/sites/3/2022/12/SF-1.jpg",
      },
      {
        title: "Bleach: Thousand-Year Blood War Part 3 Teaser Released",
        description:
          "A new teaser hints at major fights in the upcoming episodes!",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLix1btJhk5L0LBF2cEJC4YHE1kfY4Z7VJVQ&s",
      },
      {
        title: "Solo Leveling Anime Premiere Date Announced",
        description:
          "The highly anticipated anime adaptation finally gets a release date!",
        image:
          "https://cdn.oneesports.gg/cdn-data/2024/03/SoloLevelingNovel_WhereToRead_ONEEsports-1024x576.jpg",
      },
      {
        title: "Hunter x Hunter Manga Returns with New Chapters",
        description:
          "After a long hiatus, Yoshihiro Togashi continues the legendary manga.",
        image:
          "https://cdn.oneesports.gg/cdn-data/2024/04/Anime_HunterXHunter_BestTimeToWatch_image2-1024x576.jpg",
      },
      {
        title: "My Hero Academia: New Movie Announced",
        description: "A brand new My Hero Academia movie is in the works!",
        image:
          "https://static.toiimg.com/thumb/msid-107248655,width-1280,height-720,imgsize-54444,resizemode-6,overlay-toi_sw,pt-32,y_pad-40/photo.jpg",
      },
      {
        title: "Re:Zero Season 3 Release Date Revealed",
        description:
          "Subaru and Emilia’s journey continues in the upcoming season!",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmTlqJaYLTaWphfQJX_BOu3bikELPpeRkrKQ&s",
      },
      {
        title: "Black Clover: New Arc Begins!",
        description: "Asta and the Black Bulls face a powerful new enemy.",
        image:
          "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/10/maxresdefault-(3)-(2).jpg",
      },
      {
        title: "Vinland Saga Season 3 Rumored",
        description: "Thorfinn’s next chapter may be closer than expected!",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC_ebk6olIkbX50BFP9_W2FimbLOFvJl0wyA&s",
      },
      {
        title: "Blue Lock Season 2 Confirmed",
        description:
          "The intense football anime is returning with even more action.",
        image:
          "https://a.storyblok.com/f/178900/1200x675/d1870f9afa/blue-lock-s2-base-assets-16x9.jpg/m/1200x0/filters:quality(95)format(webp)",
      },
      {
        title: "Overlord Season 5 in Discussion",
        description: "Could Ainz Ooal Gown’s reign continue?",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyTv5DvItk07s_h91CIg110uCg7hmoeuVT5w&s",
      },
      {
        title: "Dr. Stone: New Season Teaser Released",
        description: "Senku’s next scientific breakthrough is coming soon!",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIE_mTCxC-eBSqE3CqoDGn7ZiQG9xZWYFxlw&s",
      },
      {
        title:
          "Mushoku Tensei: Jobless Reincarnation Season 2 Part 2 Trailer Out",
        description:
          "Rudeus’ adventure continues in this highly anticipated sequel.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsrFEYMDjE_t4wk-hpG_9RAhKoNQHqmQNb-w&s",
      },
    ],
  });
});

app.get("/movies", (req, res) => {
  res.json({
    UI: {
      header: {
        logo: "http://localhost:5000/public/temp-logo.png",
        menu: ["Home", "Movies", "New & Popular"],
      },
    },
    movies: [
      {
        id: 1,
        title: "Demon Slayer: Mugen Train",
        description: "Tanjiro and friends embark on a deadly train mission.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyh8kf17_0a8kfPv28jCbhhytQ-CUoXtoQRw&s",
        genre: "Action, Adventure, Fantasy",
        releaseYear: 2020,
      },
      {
        id: 2,
        title: "Jujutsu Kaisen 0",
        description:
          "Yuta Okkotsu joins Jujutsu High to control his powerful curse.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd6QFPHSMFI6IbWr1u6f3nUN40MN90_dEY7A&s",
        genre: "Action, Supernatural",
        releaseYear: 2021,
      },
      {
        id: 3,
        title: "One Piece Film: Red",
        description:
          "Luffy and the crew attend Uta’s concert, but things go wrong.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4zyirjYWtOUbRvXDdP1NiVVmEF4F-l6fhEA&s",
        genre: "Action, Adventure",
        releaseYear: 2022,
      },
      {
        id: 4,
        title: "Your Name",
        description:
          "Two strangers mysteriously swap bodies across time and space.",
        image:
          "https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png",
        genre: "Romance, Drama, Fantasy",
        releaseYear: 2016,
      },
      {
        id: 5,
        title: "Spirited Away",
        description: "A young girl enters a magical world ruled by spirits.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDBCGFTTVTYsTxnXu753WYc4uvywUSeiP-CQ&s",
        genre: "Fantasy, Adventure",
        releaseYear: 2001,
      },
      {
        id: 6,
        title: "Weathering With You",
        description: "A boy meets a girl who can control the weather in Tokyo.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaVIyOGr9uFvM4pZT_gBw_YsiQuU6QkVzWjQ&s",
        genre: "Romance, Fantasy",
        releaseYear: 2019,
      },
    ],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
