# Graph Report - .  (2026-05-09)

## Corpus Check
- Large corpus: 439 files · ~225,661 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 879 nodes · 1532 edges · 67 communities (58 shown, 9 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 101 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Employee Profile API|Employee Profile API]]
- [[_COMMUNITY_Admin & Employer Read APIs|Admin & Employer Read APIs]]
- [[_COMMUNITY_Employer Job Post Form|Employer Job Post Form]]
- [[_COMMUNITY_Admin Blog Management|Admin Blog Management]]
- [[_COMMUNITY_Admin Layout & Landing|Admin Layout & Landing]]
- [[_COMMUNITY_Organization & RBAC|Organization & RBAC]]
- [[_COMMUNITY_Admin Config & Announcements|Admin Config & Announcements]]
- [[_COMMUNITY_Employee CRUD APIs|Employee CRUD APIs]]
- [[_COMMUNITY_Job Read & Applicants|Job Read & Applicants]]
- [[_COMMUNITY_Blog Admin API|Blog Admin API]]
- [[_COMMUNITY_Admin Dashboard Routes|Admin Dashboard Routes]]
- [[_COMMUNITY_Package Management|Package Management]]
- [[_COMMUNITY_User Management|User Management]]
- [[_COMMUNITY_Job Search & Apply Flow|Job Search & Apply Flow]]
- [[_COMMUNITY_Organization Invites & Roles|Organization Invites & Roles]]
- [[_COMMUNITY_Admin Job Management|Admin Job Management]]
- [[_COMMUNITY_Admin Dashboard UI|Admin Dashboard UI]]
- [[_COMMUNITY_Account Settings|Account Settings]]
- [[_COMMUNITY_Admin Job Service|Admin Job Service]]
- [[_COMMUNITY_Employee School Search|Employee School Search]]
- [[_COMMUNITY_Job Apply Page|Job Apply Page]]
- [[_COMMUNITY_Authentication Service|Authentication Service]]
- [[_COMMUNITY_Applications & Status|Applications & Status]]
- [[_COMMUNITY_Announcement Service|Announcement Service]]
- [[_COMMUNITY_Signup Flow|Signup Flow]]
- [[_COMMUNITY_Public Blog|Public Blog]]
- [[_COMMUNITY_Signin Flow|Signin Flow]]
- [[_COMMUNITY_Public Job Search API|Public Job Search API]]
- [[_COMMUNITY_Admin Config Route|Admin Config Route]]
- [[_COMMUNITY_Employee Profile Basic|Employee Profile Basic]]
- [[_COMMUNITY_Employee Profile Summary|Employee Profile Summary]]
- [[_COMMUNITY_Dev Proxy|Dev Proxy]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 31 edges
2. `AdminPackageService` - 18 edges
3. `useTheme()` - 16 edges
4. `AdminBlogService` - 14 edges
5. `request()` - 14 edges
6. `getOrgId()` - 12 edges
7. `getSchoolProfileId()` - 11 edges
8. `createNotification()` - 11 edges
9. `PATCH()` - 10 edges
10. `PUT()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `createNotification()`  [INFERRED]
  app/api/v1/employer/organization/invites/route.ts → lib/notification.ts
- `createAuditLog()` --calls--> `createNotification()`  [INFERRED]
  app/api/v1/admin/jobs/service/admin-job-service.ts → lib/notification.ts
- `POST()` --calls--> `sendInviteEmail()`  [INFERRED]
  app/api/v1/employer/organization/invites/route.ts → lib/mailer.ts
- `POST()` --calls--> `createNotification()`  [INFERRED]
  app/api/v1/employer/organization/invites/accept/route.ts → lib/notification.ts
- `PATCH()` --calls--> `createNotification()`  [INFERRED]
  app/api/v1/admin/jobs/update-status/route.ts → lib/notification.ts

## Communities (67 total, 9 thin omitted)

### Community 0 - "Employee Profile API"
Cohesion: 0.05
Nodes (32): deleteEducation(), deleteLicense(), deleteResume(), deleteWorkExperience(), patchBasicInfo(), patchSummary(), postEducation(), postLicense() (+24 more)

### Community 1 - "Admin & Employer Read APIs"
Cohesion: 0.06
Nodes (32): PATCH(), GET(), PATCH(), GET(), PATCH(), adminGetAllJobsService(), getEmployeeApplicationsService(), computeProfileStrength() (+24 more)

### Community 2 - "Employer Job Post Form"
Cohesion: 0.07
Nodes (18): requestCreateJob(), requestFetchConfigOptions(), requestFetchJobById(), requestSuggestPosition(), requestUpdateJob(), requestFetchSchoolProfile(), requestUpdateSchoolProfile(), requestUploadAndSaveSchoolCover() (+10 more)

### Community 3 - "Admin Blog Management"
Cohesion: 0.05
Nodes (12): PUT(), DELETE(), handleBulkConfirm(), handlePlanSubmit(), AdminBlogService, AdminPackageService, deleteFileService(), sanitizeFileName() (+4 more)

### Community 4 - "Admin Layout & Landing"
Cohesion: 0.06
Nodes (9): AdminSidebar(), fetchLatestJobs(), ProfileEditDrawer(), buildCssVars(), buildLandingTheme(), ThemeProvider(), useTheme(), LayoutSelector() (+1 more)

### Community 5 - "Organization & RBAC"
Cohesion: 0.13
Nodes (30): GET(), DELETE(), GET(), POST(), sendInviteEmail(), DELETE(), GET(), PATCH() (+22 more)

### Community 6 - "Admin Config & Announcements"
Cohesion: 0.08
Nodes (9): requestAnnouncementHistory(), requestBroadcast(), requestRecipientCount(), batchReorderConfigOptions(), createConfigOption(), deleteConfigOption(), fetchAllConfigOptions(), updateConfigOption() (+1 more)

### Community 7 - "Employee CRUD APIs"
Cohesion: 0.12
Nodes (19): POST(), DELETE(), PUT(), verifyOwnership(), POST(), POST(), createEducationService(), deleteEducationService() (+11 more)

### Community 8 - "Job Read & Applicants"
Cohesion: 0.09
Nodes (9): requestGetApplications(), fetchApplicantsByJob(), fetchJobList(), fetchJobStats(), fetchNewApplicants(), fetchPipeline(), requestCloseJob(), requestUpdateApplicantStatus() (+1 more)

### Community 9 - "Blog Admin API"
Cohesion: 0.09
Nodes (9): requestAdminBulkDeleteBlogs(), requestAdminBulkUpdateBlogs(), requestAdminCreateBlog(), requestAdminDeleteBlog(), requestAdminListBlogs(), requestAdminUpdateBlog(), requestAiBlogAssist(), requestBlogStatsOverview() (+1 more)

### Community 11 - "Package Management"
Cohesion: 0.1
Nodes (13): requestBulkUpdatePlan(), requestCreatePlan(), requestDeletePlan(), requestGetPackagePlans(), requestListSchools(), requestPackageSummary(), requestPatchPlan(), requestSchoolDetail() (+5 more)

### Community 12 - "User Management"
Cohesion: 0.11
Nodes (8): requestDeleteUser(), requestUpdateUser(), requestUserDetail(), requestUserList(), exportCsv(), handleExportAll(), handleExportSelected(), StatsSection()

### Community 13 - "Job Search & Apply Flow"
Cohesion: 0.12
Nodes (7): fetchJobById(), fetchJobList(), fetchJobOptions(), fetchMyApplications(), buildCascaderTree(), fetchJobCategories(), fetchSchoolProfile()

### Community 14 - "Organization Invites & Roles"
Cohesion: 0.15
Nodes (14): fetchAcceptInvite(), fetchCreateRole(), fetchDelegatedAccess(), fetchDeleteRole(), fetchOrgMembers(), fetchOrgRoles(), fetchPendingInvites(), fetchRemoveMember() (+6 more)

### Community 15 - "Admin Job Management"
Cohesion: 0.14
Nodes (9): fetchAdminApplicants(), fetchAdminJobs(), fetchAuditLogs(), fetchAuditLogsByJob(), fetchDeleteJob(), fetchUpdateJobStatus(), handleFilterChange(), JobStatusTag() (+1 more)

### Community 17 - "Account Settings"
Cohesion: 0.14
Nodes (8): requestChangePassword(), requestGetAllPlans(), requestGetEmployerPackage(), requestGetPersonalInfo(), requestUpdatePersonalInfo(), handleChangePassword(), handleSavePersonal(), validator()

### Community 18 - "Admin Job Service"
Cohesion: 0.31
Nodes (7): GET(), adminDeleteJobService(), adminGetAuditLogsService(), adminUpdateJobContentService(), adminUpdateJobStatusService(), createAuditLog(), getAdminProfileId()

### Community 19 - "Employee School Search"
Cohesion: 0.22
Nodes (5): fetchSchools(), SchoolCard(), handleApply(), handleClose(), handler()

### Community 20 - "Job Apply Page"
Cohesion: 0.27
Nodes (3): fetchEmployeeProfile(), fetchJobForApply(), submitApplication()

### Community 22 - "Applications & Status"
Cohesion: 0.39
Nodes (4): POST(), POST(), createNotification(), PATCH()

### Community 23 - "Announcement Service"
Cohesion: 0.36
Nodes (4): POST(), GET(), broadcastAnnouncementService(), getAnnouncementHistoryService()

### Community 25 - "Public Blog"
Cohesion: 0.31
Nodes (3): fetchBlogById(), fetchBlogCategories(), fetchBlogs()

### Community 28 - "Public Job Search API"
Cohesion: 0.6
Nodes (3): GET(), postedAtToDate(), searchJobsService()

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handlePlanSubmit()` connect `Admin Blog Management` to `Package Management`?**
  _High betweenness centrality (0.266) - this node is a cross-community bridge._
- **Why does `handleBulkConfirm()` connect `Admin Blog Management` to `Package Management`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `GET()` (e.g. with `getEmployerProfileService()` and `ensureEmployerProfileService()`) actually correct?**
  _`GET()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `useTheme()` (e.g. with `AdminSidebar()` and `ProfileEditDrawer()`) actually correct?**
  _`useTheme()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Employee Profile API` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Admin & Employer Read APIs` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Employer Job Post Form` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._