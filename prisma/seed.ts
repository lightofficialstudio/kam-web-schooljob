import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
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
  await prisma.configOption.deleteMany();
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
      profileImageUrl:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=thanawat",
      role: "EMPLOYEE",
      profileVisibility: "public",
      teachingExperience: "5-10 ปี",
      recentSchool: "โรงเรียนนานาชาติเซนต์แมรี่",
      specialActivities:
        "ครูผู้เชี่ยวชาญด้านการสอนภาษาอังกฤษและเทคโนโลยีการศึกษา",
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
      {
        profileId: employee1.id,
        languageName: "อังกฤษ",
        proficiency: "fluent",
      },
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
      profileImageUrl:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=supaporn",
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
  await prisma.language.create({
    data: {
      profileId: employee2.id,
      languageName: "ไทย",
      proficiency: "native",
    },
  });
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
      profileImageUrl:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=maneerat",
      role: "EMPLOYEE",
      profileVisibility: "public",
      teachingExperience: "3-5 ปี",
      specialActivities:
        "ครูปฐมวัยที่มีใจรักเด็กและเชื่อในพลังของการเล่นเพื่อการเรียนรู้",
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
  await prisma.gradeCanTeach.create({
    data: { profileId: employee3.id, grade: "อนุบาล" },
  });
  await prisma.preferredProvince.createMany({
    data: [
      { profileId: employee3.id, province: "กรุงเทพมหานคร" },
      { profileId: employee3.id, province: "นนทบุรี" },
    ],
  });
  await prisma.language.create({
    data: {
      profileId: employee3.id,
      languageName: "ไทย",
      proficiency: "native",
    },
  });
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
      description:
        "โรงเรียนสาธิตชั้นนำที่เปิดสอนตั้งแต่ระดับอนุบาลถึงมัธยมปลาย",
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
      description:
        "รับสมัครครูสอนภาษาอังกฤษระดับมัธยมศึกษา ผู้สมัครต้องมีประสบการณ์อย่างน้อย 2 ปี",
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
      description:
        "รับสมัครครูปฐมวัยที่มีใจรักเด็กและมีความสามารถในการจัดกิจกรรมเสริมพัฒนาการ",
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

  await prisma.jobSubject.create({
    data: { jobId: job2.id, subject: "การศึกษาปฐมวัย" },
  });
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

  // ─── 9. ConfigOptions — ตัวเลือก dropdown ที่ Admin จัดการได้ ───
  await prisma.configOption.createMany({
    data: [
      // ── ประเภทโรงเรียน ──
      {
        group: "school_type",
        label: "โรงเรียนรัฐบาล",
        value: "โรงเรียนรัฐบาล",
        sortOrder: 1,
      },
      {
        group: "school_type",
        label: "โรงเรียนเอกชน (สามัญ)",
        value: "โรงเรียนเอกชน (สามัญ)",
        sortOrder: 2,
      },
      {
        group: "school_type",
        label: "โรงเรียนเอกชน (นานาชาติ)",
        value: "โรงเรียนเอกชน (นานาชาติ)",
        sortOrder: 3,
      },
      {
        group: "school_type",
        label: "โรงเรียนสาธิต",
        value: "โรงเรียนสาธิต",
        sortOrder: 4,
      },
      {
        group: "school_type",
        label: "โรงเรียน กศน.",
        value: "โรงเรียน กศน.",
        sortOrder: 5,
      },
      {
        group: "school_type",
        label: "ศูนย์รวมการเรียนรู้",
        value: "ศูนย์รวมการเรียนรู้",
        sortOrder: 6,
      },
      {
        group: "school_type",
        label: "โรงเรียนตำรวจตระเวนชายแดน",
        value: "โรงเรียนตำรวจตระเวนชายแดน",
        sortOrder: 7,
      },
      {
        group: "school_type",
        label: "โรงเรียนสงเคราะห์",
        value: "โรงเรียนสงเคราะห์",
        sortOrder: 8,
      },

      // ── ระดับชั้นที่เปิดสอน ──
      { group: "school_level", label: "อนุบาล", value: "อนุบาล", sortOrder: 1 },
      {
        group: "school_level",
        label: "ประถมศึกษาตอนต้น",
        value: "ประถมศึกษาตอนต้น",
        sortOrder: 2,
      },
      {
        group: "school_level",
        label: "ประถมศึกษาตอนปลาย",
        value: "ประถมศึกษาตอนปลาย",
        sortOrder: 3,
      },
      {
        group: "school_level",
        label: "มัธยมศึกษาตอนต้น",
        value: "มัธยมศึกษาตอนต้น",
        sortOrder: 4,
      },
      {
        group: "school_level",
        label: "มัธยมศึกษาตอนปลาย",
        value: "มัธยมศึกษาตอนปลาย",
        sortOrder: 5,
      },
      {
        group: "school_level",
        label: "ประกาศนียบัตรวิชาชีพ (ปวช.)",
        value: "ประกาศนียบัตรวิชาชีพ (ปวช.)",
        sortOrder: 6,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created ConfigOptions: school_type (8), school_level (6)");

  // ─── 10. ConfigOptions — หมวดหมู่งาน (job_category) สำหรับ Cascader ───
  // ✨ แทรก parent (root) ก่อน แล้วค่อยแทรก children พร้อม parentValue
  const jobCategoryParents = [
    { value: "general_subject", label: "กลุ่มวิชาสามัญ", sortOrder: 1 },
    { value: "arts_music", label: "กลุ่มศิลปะและดนตรี", sortOrder: 2 },
    { value: "pe_activities", label: "กลุ่มพละและกิจกรรม", sortOrder: 3 },
    { value: "technology", label: "กลุ่มเทคโนโลยี", sortOrder: 4 },
    { value: "early_childhood", label: "กลุ่มการศึกษาปฐมวัย", sortOrder: 5 },
    { value: "special_curriculum", label: "กลุ่มหลักสูตรพิเศษ", sortOrder: 6 },
    { value: "support_staff", label: "กลุ่มงานสนับสนุนการศึกษา", sortOrder: 7 },
    { value: "intern_parttime", label: "กลุ่มฝึกงานและพิเศษ", sortOrder: 8 },
    { value: "other", label: "ตำแหน่งอื่น ๆ", sortOrder: 9 },
  ];

  await prisma.configOption.createMany({
    data: jobCategoryParents.map((p) => ({
      group: "job_category",
      ...p,
      parentValue: null,
    })),
    skipDuplicates: true,
  });

  const jobCategoryChildren = [
    // ── กลุ่มวิชาสามัญ ──
    {
      parentValue: "general_subject",
      value: "thai_teacher",
      label: "ครูภาษาไทย",
      sortOrder: 1,
    },
    {
      parentValue: "general_subject",
      value: "math_teacher",
      label: "ครูคณิตศาสตร์",
      sortOrder: 2,
    },
    {
      parentValue: "general_subject",
      value: "science_teacher",
      label: "ครูวิทยาศาสตร์",
      sortOrder: 3,
    },
    {
      parentValue: "general_subject",
      value: "physics_teacher",
      label: "ครูฟิสิกส์",
      sortOrder: 4,
    },
    {
      parentValue: "general_subject",
      value: "chemistry_teacher",
      label: "ครูเคมี",
      sortOrder: 5,
    },
    {
      parentValue: "general_subject",
      value: "biology_teacher",
      label: "ครูชีววิทยา",
      sortOrder: 6,
    },
    {
      parentValue: "general_subject",
      value: "english_teacher",
      label: "ครูภาษาอังกฤษ",
      sortOrder: 7,
    },
    {
      parentValue: "general_subject",
      value: "chinese_teacher",
      label: "ครูภาษาจีน",
      sortOrder: 8,
    },
    {
      parentValue: "general_subject",
      value: "japanese_teacher",
      label: "ครูภาษาญี่ปุ่น",
      sortOrder: 9,
    },
    {
      parentValue: "general_subject",
      value: "social_teacher",
      label: "ครูสังคมศึกษา",
      sortOrder: 10,
    },
    {
      parentValue: "general_subject",
      value: "primary_teacher",
      label: "ครูประถมศึกษา",
      sortOrder: 11,
    },
    {
      parentValue: "general_subject",
      value: "homeroom_teacher",
      label: "ครูประจำชั้น",
      sortOrder: 12,
    },
    {
      parentValue: "general_subject",
      value: "career_teacher",
      label: "ครูการงานอาชีพ / คหกรรม",
      sortOrder: 13,
    },
    {
      parentValue: "general_subject",
      value: "integrated_teacher",
      label: "ครูบูรณาการ",
      sortOrder: 14,
    },

    // ── กลุ่มศิลปะและดนตรี ──
    {
      parentValue: "arts_music",
      value: "art_teacher",
      label: "ครูศิลปะ",
      sortOrder: 1,
    },
    {
      parentValue: "arts_music",
      value: "thai_music_teacher",
      label: "ครูดนตรีไทย",
      sortOrder: 2,
    },
    {
      parentValue: "arts_music",
      value: "music_teacher",
      label: "ครูดนตรีสากล",
      sortOrder: 3,
    },
    {
      parentValue: "arts_music",
      value: "drama_teacher",
      label: "ครูการแสดง",
      sortOrder: 4,
    },
    {
      parentValue: "arts_music",
      value: "instrument_teacher",
      label: "ครูสอนดนตรี",
      sortOrder: 5,
    },
    {
      parentValue: "arts_music",
      value: "dance_classical",
      label: "ครูนาฏศิลป์",
      sortOrder: 6,
    },
    {
      parentValue: "arts_music",
      value: "dance_teacher",
      label: "ครูสอนเต้น",
      sortOrder: 7,
    },
    {
      parentValue: "arts_music",
      value: "vocal_teacher",
      label: "ครูสอนร้องเพลง",
      sortOrder: 8,
    },
    {
      parentValue: "arts_music",
      value: "band_teacher",
      label: "ครูวงโยธวาทิต/วงดุริยางค์",
      sortOrder: 9,
    },

    // ── กลุ่มพละและกิจกรรม ──
    {
      parentValue: "pe_activities",
      value: "pe_teacher",
      label: "ครูพลศึกษา/สุขศึกษา",
      sortOrder: 1,
    },
    {
      parentValue: "pe_activities",
      value: "sport_teacher",
      label: "ครูสอนกีฬา",
      sortOrder: 2,
    },
    {
      parentValue: "pe_activities",
      value: "swim_teacher",
      label: "ครูสอนว่ายน้ำ",
      sortOrder: 3,
    },
    {
      parentValue: "pe_activities",
      value: "scout_teacher",
      label: "ครูลูกเสือ",
      sortOrder: 4,
    },

    // ── กลุ่มเทคโนโลยี ──
    {
      parentValue: "technology",
      value: "computer_teacher",
      label: "ครูคอมพิวเตอร์",
      sortOrder: 1,
    },
    {
      parentValue: "technology",
      value: "coding_teacher",
      label: "ครูสอนเขียนโปรแกรม",
      sortOrder: 2,
    },
    {
      parentValue: "technology",
      value: "robot_teacher",
      label: "ครูสอนโรบอท",
      sortOrder: 3,
    },
    {
      parentValue: "technology",
      value: "it_teacher",
      label: "ครูเทคโนโลยีสารสนเทศ",
      sortOrder: 4,
    },

    // ── กลุ่มการศึกษาปฐมวัย ──
    {
      parentValue: "early_childhood",
      value: "preschool_teacher",
      label: "ครูปฐมวัย",
      sortOrder: 1,
    },
    {
      parentValue: "early_childhood",
      value: "kindergarten_teacher",
      label: "ครูอนุบาล",
      sortOrder: 2,
    },
    {
      parentValue: "early_childhood",
      value: "kinder_assistant",
      label: "ครูพี่เลี้ยงอนุบาล",
      sortOrder: 3,
    },
    {
      parentValue: "early_childhood",
      value: "child_care",
      label: "ครูพี่เลี้ยงเด็ก",
      sortOrder: 4,
    },

    // ── กลุ่มหลักสูตรพิเศษ ──
    {
      parentValue: "special_curriculum",
      value: "special_ed_teacher",
      label: "ครูการศึกษาพิเศษ",
      sortOrder: 1,
    },
    {
      parentValue: "special_curriculum",
      value: "shadow_teacher",
      label: "ครูประกบเด็กพิเศษ",
      sortOrder: 2,
    },
    {
      parentValue: "special_curriculum",
      value: "stem_teacher",
      label: "ครู STEM",
      sortOrder: 3,
    },
    {
      parentValue: "special_curriculum",
      value: "ep_teacher",
      label: "ครู English Program",
      sortOrder: 4,
    },
    {
      parentValue: "special_curriculum",
      value: "inter_teacher",
      label: "ครูหลักสูตรนานาชาติ",
      sortOrder: 5,
    },
    {
      parentValue: "special_curriculum",
      value: "montessori_teacher",
      label: "ครู Montessori",
      sortOrder: 6,
    },

    // ── กลุ่มงานสนับสนุนการศึกษา ──
    {
      parentValue: "support_staff",
      value: "librarian",
      label: "ครูบรรณารักษ์",
      sortOrder: 1,
    },
    {
      parentValue: "support_staff",
      value: "counselor",
      label: "ครูแนะแนว",
      sortOrder: 2,
    },
    {
      parentValue: "support_staff",
      value: "admin_teacher",
      label: "ครูธุรการ",
      sortOrder: 3,
    },
    {
      parentValue: "support_staff",
      value: "school_admin",
      label: "เจ้าหน้าที่ธุรการโรงเรียน",
      sortOrder: 4,
    },
    {
      parentValue: "support_staff",
      value: "pr_officer",
      label: "เจ้าหน้าที่ประชาสัมพันธ์",
      sortOrder: 5,
    },
    {
      parentValue: "support_staff",
      value: "marketing_officer",
      label: "เจ้าหน้าที่การตลาดโรงเรียน",
      sortOrder: 6,
    },
    {
      parentValue: "support_staff",
      value: "foreign_coord",
      label: "ครูประสานงานครูต่างชาติ",
      sortOrder: 7,
    },
    {
      parentValue: "support_staff",
      value: "nurse_teacher",
      label: "ครูพยาบาล",
      sortOrder: 8,
    },
    {
      parentValue: "support_staff",
      value: "registrar",
      label: "เจ้าหน้าที่ทะเบียนวัดผล",
      sortOrder: 9,
    },
    {
      parentValue: "support_staff",
      value: "academic_dept",
      label: "ฝ่ายวิชาการ",
      sortOrder: 10,
    },
    {
      parentValue: "support_staff",
      value: "school_director",
      label: "ผู้บริหาร/ผู้อำนวยการโรงเรียน",
      sortOrder: 11,
    },
    {
      parentValue: "support_staff",
      value: "psychologist",
      label: "นักจิตวิทยา",
      sortOrder: 12,
    },
    {
      parentValue: "support_staff",
      value: "hr_officer",
      label: "เจ้าหน้าที่ HR/ฝ่ายบุคคล",
      sortOrder: 13,
    },
    {
      parentValue: "support_staff",
      value: "procurement",
      label: "เจ้าหน้าที่จัดซื้อ",
      sortOrder: 14,
    },
    {
      parentValue: "support_staff",
      value: "secretary",
      label: "เลขานุการ",
      sortOrder: 15,
    },

    // ── กลุ่มฝึกงานและพิเศษ ──
    {
      parentValue: "intern_parttime",
      value: "intern",
      label: "นักศึกษาฝึกงาน",
      sortOrder: 1,
    },
    {
      parentValue: "intern_parttime",
      value: "student_teacher",
      label: "ครูฝึกสอน",
      sortOrder: 2,
    },
    {
      parentValue: "intern_parttime",
      value: "parttime_teacher",
      label: "ครูพาร์ทไทม์",
      sortOrder: 3,
    },
    {
      parentValue: "intern_parttime",
      value: "assistant_teacher",
      label: "ครูผู้ช่วย",
      sortOrder: 4,
    },
  ];

  await prisma.configOption.createMany({
    data: jobCategoryChildren.map((c) => ({ group: "job_category", ...c })),
    skipDuplicates: true,
  });

  const totalChildren = jobCategoryChildren.length;
  console.log(
    `✅ Created ConfigOptions: job_category — ${jobCategoryParents.length} parents, ${totalChildren} children`,
  );

  // ─── 11. PackagePlan — ราคาตั้งต้น (Admin แก้ไขได้ผ่าน Dashboard) ───
  await prisma.packagePlan.deleteMany();
  await prisma.packagePlan.createMany({
    data: [
      { plan: "basic", price: 0 },
      { plan: "premium", price: 1990 },
      { plan: "enterprise", price: 4990 },
    ],
  });
  console.log(
    "✅ Created PackagePlans: basic(0), premium(1990), enterprise(4990)",
  );
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
