import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "e-report-c0224";
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const PRIVATE_KEY = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const DEFAULT_PASSWORD = "Password123!";

const USERS = [
  { fullName: "Ahmad Hidayat", email: "admin@smktexmaco.sch.id", role: "admin" },
  { fullName: "Dewi Sartika", email: "gurubk1@smktexmaco.sch.id", role: "guru_bk" },
  { fullName: "Bambang Hermawan", email: "gurubk2@smktexmaco.sch.id", role: "guru_bk" },
  { fullName: "Rina Marlina", email: "stp2k1@smktexmaco.sch.id", role: "stp2k" },
  { fullName: "Hendra Gunawan", email: "stp2k2@smktexmaco.sch.id", role: "stp2k" },
  { fullName: "Siti Nurjanah", email: "walikelas1@smktexmaco.sch.id", role: "wali_kelas" },
  { fullName: "Agus Prasetyo", email: "walikelas2@smktexmaco.sch.id", role: "wali_kelas" },
  { fullName: "Fitri Handayani", email: "walikelas3@smktexmaco.sch.id", role: "wali_kelas" },
  { fullName: "Drs. H. Supriyono", email: "kesiswaan@smktexmaco.sch.id", role: "kesiswaan" },
  { fullName: "Asep Rudi", email: "ortu1@smktexmaco.sch.id", role: "orang_tua" },
  { fullName: "Nina Marlina", email: "ortu2@smktexmaco.sch.id", role: "orang_tua" },
  { fullName: "Cecep Hermawan", email: "ortu3@smktexmaco.sch.id", role: "orang_tua" },
  { fullName: "Rizky Pratama", email: "siswa1@smktexmaco.sch.id", role: "siswa" },
  { fullName: "Anisa Putri", email: "siswa2@smktexmaco.sch.id", role: "siswa" },
  { fullName: "Doni Saputra", email: "siswa3@smktexmaco.sch.id", role: "siswa" },
];

function initFirebase() {
  if (admin.apps.length) return admin;

  if (CLIENT_EMAIL && PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: PROJECT_ID,
        clientEmail: CLIENT_EMAIL,
        privateKey: PRIVATE_KEY,
      }),
    });
  } else {
    const saPaths = [
      "./scripts/service-account.json",
      "./service-account.json",
      "../service-account.json",
      "/etc/secrets/service-account.json",
    ];
    let loaded = false;
    for (const p of saPaths) {
      if (existsSync(p)) {
        const sa = JSON.parse(readFileSync(p, "utf-8"));
        admin.initializeApp({ credential: admin.credential.cert(sa) });
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      console.error("No service account found");
      process.exit(1);
    }
  }
  return admin;
}

async function main() {
  initFirebase();
  const auth = admin.auth();

  let created = 0, skipped = 0, errors = 0;

  for (const u of USERS) {
    try {
      // Check if exists
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(u.email);
        console.log(`  ⏭  ${u.email} already exists (UID: ${userRecord.uid})`);
        // Update claims anyway
        await auth.setCustomUserClaims(userRecord.uid, { role: u.role });
        skipped++;
        continue;
      } catch {
        // User doesn't exist, create
      }

      userRecord = await auth.createUser({
        email: u.email,
        password: DEFAULT_PASSWORD,
        displayName: u.fullName,
        emailVerified: true,
      });

      await auth.setCustomUserClaims(userRecord.uid, { role: u.role });

      console.log(`  ✅ ${u.email} (${u.role}) — UID: ${userRecord.uid}`);
      created++;
    } catch (err) {
      console.error(`  ❌ ${u.email}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped, ${errors} errors`);
  console.log(`Default password: ${DEFAULT_PASSWORD}`);
}

main().catch(console.error);
