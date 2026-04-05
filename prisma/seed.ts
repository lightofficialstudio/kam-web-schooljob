import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import path from "path";

// ✨ โหลด .env ก่อนสร้าง PrismaClient (จำเป็นสำหรับ tsx ที่รันนอก Next.js)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ✨ Seed script สำหรับ Dev/Test — สร้างข้อมูลตัวอย่างครบทุก role
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ─── ล้างข้อมูลเก่าก่อน (development only) ───
  await prisma.notification.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.jobBenefit.deleteMany();
  await prisma.jobGrade.deleteMany();
  await prisma.jobSubject.deleteMany();
  await prisma.job.deleteMany();
  await prisma.schoolBenefit.deleteMany();
  await prisma.schoolProfile.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.language.deleteMany();
  await prisma.preferredProvince.deleteMany();
  await prisma.gradeCanTeach.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.license.deleteMany();
  await prisma.education.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.profile.deleteMany();

  console.log("✅ Cleared existing data");

  // ─── 1. EMPLOYEE: ครูภาษาอังกฤษ ───
  const employee1 = await prisma.profile.create({
    data: {
      userId: "seed-employee-001",
      email: "thanawat.learn@seed.com",
      firstName: "ธนวัฒน์",
      lastName: "เรียนรู้ดี",
      phoneNumber: "081-234-5678",
      gender: "ชาย",
      dateOfBirth: new Date("1995-05-15"),
      nationality: "ไทย",
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=thanawat",
      role: "EMPLOYEE",
      profileVisibility: "public",
      teachingExperience: "5-10 ปี",
      recentSchool: "โรงเรียนนานาชาติเซนต์แมรี่",
      specialActivities: "ครูผู้เชี่ยวชาญด้านการสอนภาษาอังกฤษและเทคโนโลยีการศึกษา",
      canRelocate: true,
      licenseStatus: "has_license",
    },
  });

  // Work Experiences
  await prisma.workExperience.createMany({
    data: [
      {
        profileId: employee1.id,
        jobTitle: "ครูสอนภาษาอังกฤษ",
        companyName: "โรงเรียนนานาชาติเซนต์แมรี่",
        startDate: new Date("2022-05-01"),
        inPresent: true,
        description: "สอนภาษาอังกฤษระดับ G10–12 เน้นทักษะการสื่อสาร",
      },
      {
        profileId: employee1.id,
        jobTitle: "วิทยากรพิเศษ",
        companyName: "สถาบันกวดวิชาเอกวิทย์",
        startDate: new Date("2020-06-01"),
        endDate: new Date("2022-04-30"),
        inPresent: false,
        description: "ผลิตสื่อวิดีโอเตรียมสอบ TCAS",
      },
    ],
  });

  // Educations
  await prisma.education.createMany({
    data: [
      {
        profileId: employee1.id,
        level: "ปริญญาโท",
        institution: "มหาวิทยาลัยธรรมศาสตร์",
        major: "ศิลปศาสตรมหาบัณฑิต (การสอนภาษาอังกฤษ)",
        graduationYear: 2565,
        gpa: 3.85,
      },
      {
        profileId: employee1.id,
        level: "ปริญญาตรี",
        institution: "จุฬาลงกรณ์มหาวิทยาลัย",
        major: "ครุศาสตรบัณฑิต (ภาษาอังกฤษ)",
        graduationYear: 2562,
        gpa: 3.75,
      },
    ],
  });

  // Specializations
  await prisma.specialization.createMany({
    data: [
      { profileId: employee1.id, subject: "การสอนภาษาอังกฤษ (ESL/EFL)" },
      { profileId: employee1.id, subject: "การออกแบบบทเรียนออนไลน์" },
      { profileId: employee1.id, subject: "เทคโนโลยีเพื่อการศึกษา (EdTech)" },
    ],
  });

  // GradeCanTeaches
  await prisma.gradeCanTeach.createMany({
    data: [
      { profileId: employee1.id, grade: "มัธยมศึกษาตอนต้น" },
      { profileId: employee1.id, grade: "มัธยมศึกษาตอนปลาย" },
    ],
  });

  // PreferredProvinces
  await prisma.preferredProvince.createMany({
    data: [
      { profileId: employee1.id, province: "กรุงเทพมหานคร" },
      { profileId: employee1.id, province: "นนทบุรี" },
    ],
  });

  // Languages
  await prisma.language.createMany({
    data: [
      { profileId: employee1.id, languageName: "ไทย", proficiency: "native" },
      { profileId: employee1.id, languageName: "อังกฤษ", proficiency: "fluent" },
    ],
  });

  // Skills
  await prisma.skill.createMany({
    data: [
      { profileId: employee1.id, skillName: "Microsoft Office" },
      { profileId: employee1.id, skillName: "Google Classroom" },
      { profileId: employee1.id, skillName: "Canva for Education" },
    ],
  });

  // Resume
  const resume1 = await prisma.resume.create({
    data: {
      profileId: employee1.id,
      fileName: "Resume_Thanawat_2567.pdf",
      fileSize: 840 * 1024,
      fileUrl: "https://example.com/resumes/thanawat.pdf",
      isActive: true,
    },
  });

  // Set activeResume
  await prisma.profile.update({
    where: { id: employee1.id },
    data: { activeResumeId: resume1.id },
  });

  console.log("✅ Created EMPLOYEE 1: ธนวัฒน์ เรียนรู้ดี");

  // ─── 2. EMPLOYEE: ครูคณิตศาสตร์ (รุ่นใหม่) ───
  const employee2 = await prisma.profile.create({
    data: {
      userId: "seed-employee-002",
      email: "supaporn.math@seed.com",
      firstName: "สุภาพร",
      lastName: "คิดเลขเก่ง",
      phoneNumber: "089-765-4321",
      gender: "หญิง",
      dateOfBirth: new Date("2000-08-22"),
      nationality: "ไทย",
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=supaporn",
      role: "EMPLOYEE",
      profileVisibility: "apply_only",
      teachingExperience: "น้อยกว่า 1 ปี",
      specialActivities: "ครูรุ่นใหม่ที่หลงรักคณิตศาสตร์และวิทยาศาสตร์",
      canRelocate: false,
      licenseStatus: "pending",
    },
  });

  await prisma.specialization.createMany({
    data: [
      { profileId: employee2.id, subject: "คณิตศาสตร์" },
      { profileId: employee2.id, subject: "วิทยาศาสตร์" },
      { profileId: employee2.id, subject: "ฟิสิกส์" },
    ],
  });
  await prisma.gradeCanTeach.createMany({
    data: [
      { profileId: employee2.id, grade: "มัธยมศึกษาตอนต้น" },
      { profileId: employee2.id, grade: "มัธยมศึกษาตอนปลาย" },
    ],
  });
  await prisma.preferredProvince.createMany({
    data: [
      { profileId: employee2.id, province: "กรุงเทพมหานคร" },
      { profileId: employee2.id, province: "สมุทรปราการ" },
    ],
  });
  await prisma.language.create({ data: { profileId: employee2.id, languageName: "ไทย", proficiency: "native" } });
  await prisma.skill.createMany({
    data: [
      { profileId: employee2.id, skillName: "GeoGebra" },
      { profileId: employee2.id, skillName: "Kahoot" },
    ],
  });

  console.log("✅ Created EMPLOYEE 2: สุภาพร คิดเลขเก่ง");

  // ─── 3. EMPLOYEE: ครูปฐมวัย ───
  const employee3 = await prisma.profile.create({
    data: {
      userId: "seed-employee-003",
      email: "maneerat.kids@seed.com",
      firstName: "มณีรัตน์",
      lastName: "รักเด็กดี",
      phoneNumber: "062-111-9999",
      gender: "หญิง",
      dateOfBirth: new Date("1992-03-10"),
      nationality: "ไทย",
      profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maneerat",
      role: "EMPLOYEE",
      profileVisibility: "public",
      teachingExperience: "3-5 ปี",
      specialActivities: "ครูปฐมวัยที่มีใจรักเด็กและเชื่อในพลังของการเล่นเพื่อการเรียนรู้",
      canRelocate: false,
      licenseStatus: "not_required",
    },
  });

  await prisma.specialization.createMany({
    data: [
      { profileId: employee3.id, subject: "การศึกษาปฐมวัย" },
      { profileId: employee3.id, subject: "Play-based Learning" },
    ],
  });
  await prisma.gradeCanTeach.create({ data: { profileId: employee3.id, grade: "อนุบาล" } });
  await prisma.preferredProvince.createMany({
    data: [
      { profileId: employee3.id, province: "กรุงเทพมหานคร" },
      { profileId: employee3.id, province: "นนทบุรี" },
    ],
  });
  await prisma.language.create({ data: { profileId: employee3.id, languageName: "ไทย", proficiency: "native" } });
  await prisma.skill.createMany({
    data: [
      { profileId: employee3.id, skillName: "Canva" },
      { profileId: employee3.id, skillName: "Microsoft Office" },
    ],
  });

  console.log("✅ Created EMPLOYEE 3: มณีรัตน์ รักเด็กดี");

  // ─── 4. EMPLOYER: โรงเรียนสาธิต ───
  const employer1 = await prisma.profile.create({
    data: {
      userId: "seed-employer-001",
      email: "admin@satit-school.seed.com",
      firstName: "ผู้บริหาร",
      lastName: "โรงเรียนสาธิต",
      phoneNumber: "02-123-4567",
      role: "EMPLOYER",
    },
  });

  const school1 = await prisma.schoolProfile.create({
    data: {
      profileId: employer1.id,
      schoolName: "โรงเรียนสาธิตมหาวิทยาลัยเกษตรศาสตร์",
      schoolType: "สาธิต",
      affiliation: "สพฐ.",
      province: "กรุงเทพมหานคร",
      district: "จตุจักร",
      address: "50 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900",
      website: "https://satit.ku.ac.th",
      phone: "02-942-8900",
      description: "โรงเรียนสาธิตชั้นนำที่เปิดสอนตั้งแต่ระดับอนุบาลถึงมัธยมปลาย",
      vision: "ผลิตนักเรียนที่มีความรู้ คุณธรรม และทักษะแห่งศตวรรษที่ 21",
      studentCount: 3200,
      teacherCount: 180,
      foundedYear: 2510,
    },
  });

  await prisma.schoolBenefit.createMany({
    data: [
      { schoolProfileId: school1.id, benefit: "ประกันสังคม" },
      { schoolProfileId: school1.id, benefit: "โบนัสประจำปี" },
      { schoolProfileId: school1.id, benefit: "กองทุนสำรองเลี้ยงชีพ" },
    ],
  });

  // ─── 5. Jobs ───
  const job1 = await prisma.job.create({
    data: {
      schoolProfileId: school1.id,
      title: "ครูสอนภาษาอังกฤษ",
      description: "รับสมัครครูสอนภาษาอังกฤษระดับมัธยมศึกษา ผู้สมัครต้องมีประสบการณ์อย่างน้อย 2 ปี",
      jobType: "Full-time",
      province: "กรุงเทพมหานคร",
      district: "จตุจักร",
      salaryMin: 18000,
      salaryMax: 35000,
      salaryNegotiable: true,
      licenseRequired: "required",
      positionsAvailable: 2,
      status: "OPEN",
      deadline: new Date("2026-06-30"),
    },
  });

  await prisma.jobSubject.createMany({
    data: [
      { jobId: job1.id, subject: "การสอนภาษาอังกฤษ (ESL/EFL)" },
      { jobId: job1.id, subject: "ภาษาอังกฤษ" },
    ],
  });
  await prisma.jobGrade.createMany({
    data: [
      { jobId: job1.id, grade: "มัธยมศึกษาตอนต้น" },
      { jobId: job1.id, grade: "มัธยมศึกษาตอนปลาย" },
    ],
  });
  await prisma.jobBenefit.createMany({
    data: [
      { jobId: job1.id, benefit: "ประกันสังคม" },
      { jobId: job1.id, benefit: "โบนัสประจำปี" },
    ],
  });

  const job2 = await prisma.job.create({
    data: {
      schoolProfileId: school1.id,
      title: "ครูปฐมวัย",
      description: "รับสมัครครูปฐมวัยที่มีใจรักเด็กและมีความสามารถในการจัดกิจกรรมเสริมพัฒนาการ",
      jobType: "Full-time",
      province: "กรุงเทพมหานคร",
      district: "จตุจักร",
      salaryMin: 15000,
      salaryMax: 25000,
      salaryNegotiable: false,
      licenseRequired: "not_required",
      positionsAvailable: 1,
      status: "OPEN",
      deadline: new Date("2026-05-31"),
    },
  });

  await prisma.jobSubject.create({ data: { jobId: job2.id, subject: "การศึกษาปฐมวัย" } });
  await prisma.jobGrade.create({ data: { jobId: job2.id, grade: "อนุบาล" } });
  await prisma.jobBenefit.createMany({
    data: [
      { jobId: job2.id, benefit: "ประกันสังคม" },
      { jobId: job2.id, benefit: "ค่าอาหาร" },
    ],
  });

  console.log("✅ Created EMPLOYER: โรงเรียนสาธิตมหาวิทยาลัยเกษตรศาสตร์");
  console.log("✅ Created Jobs: ครูภาษาอังกฤษ, ครูปฐมวัย");

  // ─── 6. Application ───
  await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: employee1.id,
      resumeId: resume1.id,
      status: "PENDING",
      coverLetter: "ข้าพเจ้ามีความสนใจและความมุ่งมั่นในการเป็นครูสอนภาษาอังกฤษ",
    },
  });

  console.log("✅ Created Application: ธนวัฒน์ สมัคร ครูภาษาอังกฤษ");

  // ─── 7. ADMIN ───
  await prisma.profile.create({
    data: {
      userId: "seed-admin-001",
      email: "admin@kam-schooljob.seed.com",
      firstName: "แอดมิน",
      lastName: "ระบบ",
      role: "ADMIN",
    },
  });

  console.log("✅ Created ADMIN: แอดมิน ระบบ");

  // ─── 8. Blog ───
  await prisma.blog.createMany({
    data: [
      {
        authorId: employer1.id,
        title: "5 เทคนิคสัมภาษณ์งานครูให้ผ่าน",
        slug: "5-interview-tips-for-teachers",
        content: "การสัมภาษณ์งานครูมีความแตกต่างจากสายงานอื่น...",
        excerpt: "เรียนรู้เทคนิคการสัมภาษณ์งานครูที่โรงเรียนชั้นนำต้องการ",
        category: "เคล็ดลับสมัครงาน",
        tags: JSON.stringify(["สัมภาษณ์งาน", "ครู", "เทคนิค"]),
        status: "PUBLISHED",
        publishedAt: new Date("2026-03-01"),
      },
      {
        authorId: employer1.id,
        title: "ข่าวการศึกษา: นโยบายครูประจำปี 2567",
        slug: "education-news-teacher-policy-2567",
        content: "กระทรวงศึกษาธิการประกาศนโยบายใหม่สำหรับครูประจำปี 2567...",
        excerpt: "สรุปนโยบายสำคัญที่ครูไทยต้องรู้ในปี 2567",
        category: "ข่าวการศึกษา",
        tags: JSON.stringify(["นโยบาย", "ครู", "2567"]),
        status: "PUBLISHED",
        publishedAt: new Date("2026-02-15"),
      },
    ],
  });

  console.log("✅ Created Blogs: 2 articles");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
