/**
 * Seed script — adds sample temples, darshan slots, and an admin user.
 * Run with: npm run seed  (from the backend folder, after configuring .env)
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Temple = require("../models/Temple");
const DarshanSlot = require("../models/DarshanSlot");

const sampleTemples = [
  {
    name: "Tirumala Tirupati Venkateswara Temple",
    deity: "Lord Venkateswara (Vishnu)",
    location: { city: "Tirupati", state: "Andhra Pradesh", address: "Tirumala Hills, Tirupati" },
    description:
      "One of the most visited pilgrimage sites in the world, dedicated to Lord Venkateswara.",
    imageUrl: "https://images.unsplash.com/photo-1609948543331-b8a94036094f?w=800",
    timings: { openTime: "03:00", closeTime: "23:00" },
    facilities: ["Prasadam", "Parking", "Accommodation", "Wheelchair Access"],
  },
  {
    name: "Meenakshi Amman Temple",
    deity: "Goddess Meenakshi (Parvati)",
    location: { city: "Madurai", state: "Tamil Nadu", address: "Madurai Main, Madurai" },
    description:
      "Historic temple dedicated to Meenakshi, famous for its stunning Dravidian architecture.",
    imageUrl: "https://images.unsplash.com/photo-1621996659490-3d6b0e8b6ff5?w=800",
    timings: { openTime: "05:00", closeTime: "21:30" },
    facilities: ["Prasadam", "Guided Tours", "Parking"],
  },
  {
    name: "Golden Temple (Harmandir Sahib)",
    deity: "Sri Guru Granth Sahib",
    location: { city: "Amritsar", state: "Punjab", address: "Golden Temple Rd, Amritsar" },
    description: "The holiest Gurdwara of Sikhism, known for its stunning golden architecture.",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
    timings: { openTime: "00:00", closeTime: "23:59" },
    facilities: ["Free Langar", "Accommodation", "Wheelchair Access"],
  },
  {
    name: "Kashi Vishwanath Temple",
    deity: "Lord Shiva",
    location: { city: "Varanasi", state: "Uttar Pradesh", address: "Vishwanath Gali, Varanasi" },
    description: "One of the twelve Jyotirlingas, situated on the banks of the holy river Ganges.",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f70fe2734799?w=800",
    timings: { openTime: "02:30", closeTime: "23:00" },
    facilities: ["Prasadam", "Ganga Aarti View", "Locker Facility"],
  },
  {
    name: "Siddhivinayak Temple",
    deity: "Lord Ganesha",
    location: { city: "Mumbai", state: "Maharashtra", address: "Prabhadevi, Mumbai" },
    description: "Famous Ganesha temple visited by lakhs of devotees every year.",
    imageUrl: "https://images.unsplash.com/photo-1600100337179-2f5f1a1b1b1f?w=800",
    timings: { openTime: "05:30", closeTime: "22:00" },
    facilities: ["Prasadam", "Parking", "Online Darshan"],
  },
  {
    name: "Vaishno Devi Temple",
    deity: "Goddess Vaishno Devi",
    location: { city: "Katra", state: "Jammu & Kashmir", address: "Trikuta Hills, Katra" },
    description: "A revered Hindu temple located in the Trikuta Hills, reached via a scenic trek.",
    imageUrl: "https://images.unsplash.com/photo-1590766940554-634a7ad74152?w=800",
    timings: { openTime: "00:00", closeTime: "23:59" },
    facilities: ["Helicopter Service", "Battery Car", "Accommodation"],
  },
];

const generateSlotsForTemple = (templeId) => {
  const slots = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const timeBlocks = [
      { startTime: "06:00", endTime: "07:00" },
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "12:00", endTime: "13:00" },
      { startTime: "16:00", endTime: "17:00" },
      { startTime: "18:00", endTime: "19:00" },
    ];

    timeBlocks.forEach((block, idx) => {
      slots.push({
        temple: templeId,
        date,
        startTime: block.startTime,
        endTime: block.endTime,
        totalCapacity: idx === 0 ? 50 : 100,
        bookedCount: 0,
        pricePerTicket: idx === 0 ? 300 : 0, // first slot = VIP paid darshan
        slotType: idx === 0 ? "VIP" : "GENERAL",
      });
    });
  }
  return slots;
};

const seedData = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing Temples & Slots...");
    await Temple.deleteMany();
    await DarshanSlot.deleteMany();

    // Create/find admin user
    let admin = await User.findOne({ email: "admin@darshanease.com" });
    if (!admin) {
      admin = await User.create({
        name: "System Admin",
        email: "admin@darshanease.com",
        password: "Admin@123",
        role: "ADMIN",
      });
      console.log("👤 Admin user created -> admin@darshanease.com / Admin@123");
    }

    console.log("🛕 Inserting sample temples...");
    const createdTemples = await Temple.insertMany(
      sampleTemples.map((t) => ({ ...t, createdBy: admin._id }))
    );

    console.log("🕐 Generating darshan slots for each temple...");
    let allSlots = [];
    createdTemples.forEach((temple) => {
      allSlots = allSlots.concat(generateSlotsForTemple(temple._id));
    });
    await DarshanSlot.insertMany(allSlots);

    console.log(`✅ Seed complete: ${createdTemples.length} temples, ${allSlots.length} slots.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
