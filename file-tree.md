# File Tree: KAM-WEB-SCHOOLJOB

**Generated:** 4/19/2026, 12:42:55 PM
**Root Path:** `/Users/light/Desktop/PORTFOLIO/Kam-Business/KAM-WEB-SCHOOLJOB`

```
├── 📁 .claude
│   ├── 📁 skills
│   │   ├── 📁 auth-pattern
│   │   │   └── 📝 SKILL.md
│   │   ├── 📁 backend-standard
│   │   │   └── 📝 SKILL.md
│   │   ├── 📁 commit-standard
│   │   │   └── 📝 SKILL.md
│   │   ├── 📁 frontend-standard
│   │   │   └── 📝 SKILL.md
│   │   ├── 📁 prisma-pattern
│   │   │   └── 📝 SKILL.md
│   │   └── 📁 ui-theme
│   │       └── 📝 SKILL.md
│   ├── 📁 worktrees
│   └── ⚙️ settings.local.json
├── 📁 .github
│   └── 📁 skills
│       ├── 📁 next-ant-design
│       │   └── 📝 POLICY.md
│       ├── 📁 next-best-practices
│       │   ├── 📝 SKILL.md
│       │   ├── 📝 async-patterns.md
│       │   ├── 📝 bundling.md
│       │   ├── 📝 data-patterns.md
│       │   ├── 📝 debug-tricks.md
│       │   ├── 📝 directives.md
│       │   ├── 📝 error-handling.md
│       │   ├── 📝 file-conventions.md
│       │   ├── 📝 font.md
│       │   ├── 📝 functions.md
│       │   ├── 📝 hydration-error.md
│       │   ├── 📝 image.md
│       │   ├── 📝 metadata.md
│       │   ├── 📝 parallel-routes.md
│       │   ├── 📝 route-handlers.md
│       │   ├── 📝 rsc-boundaries.md
│       │   ├── 📝 runtime-selection.md
│       │   ├── 📝 scripts.md
│       │   ├── 📝 self-hosting.md
│       │   └── 📝 suspense-boundaries.md
│       ├── 📁 next-cache-components
│       │   └── 📝 SKILL.md
│       └── 📁 next-upgrade
│           └── 📝 SKILL.md
├── 📁 _document
│   ├── 📁 _api
│   │   └── 📝 api-map.md
│   └── 📁 _database
│       ├── 📝 connection-guide.md
│       └── 📝 database-design.md
├── 📁 app
│   ├── 📁 api
│   │   └── 📁 v1
│   │       ├── 📁 admin
│   │       │   ├── 📁 announcements
│   │       │   │   ├── 📁 broadcast
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 count
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 history
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 announcement-service.ts
│   │       │   │   └── 📁 validation
│   │       │   │       └── 📄 announcement-schema.ts
│   │       │   ├── 📁 audit-logs
│   │       │   │   └── 📄 route.ts
│   │       │   ├── 📁 blogs
│   │       │   │   ├── 📁 ai
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 bulk-delete
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 bulk-update
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 create
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 delete
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 read
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 blog-service.ts
│   │       │   │   ├── 📁 stats
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 update
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   └── 📁 validation
│   │       │   │       └── 📄 blog-schema.ts
│   │       │   ├── 📁 config
│   │       │   │   ├── 📁 reorder
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   └── 📄 route.ts
│   │       │   ├── 📁 dashboard
│   │       │   │   └── 📄 route.ts
│   │       │   ├── 📁 jobs
│   │       │   │   ├── 📁 applicants
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 create
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 delete
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 get-one
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 read
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 admin-job-service.ts
│   │       │   │   ├── 📁 update
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   └── 📁 update-status
│   │       │   │       └── 📄 route.ts
│   │       │   ├── 📁 packages
│   │       │   │   ├── 📁 bulk-update
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 plans
│   │       │   │   │   ├── 📁 [plan]
│   │       │   │   │   │   └── 📄 route.ts
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 read
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 school-detail
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 package-service.ts
│   │       │   │   ├── 📁 update
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   └── 📁 validation
│   │       │   │       └── 📄 package-schema.ts
│   │       │   ├── 📁 schools
│   │       │   │   └── 📁 read
│   │       │   │       └── 📄 route.ts
│   │       │   └── 📁 users
│   │       │       ├── 📁 [id]
│   │       │       │   └── 📄 route.ts
│   │       │       └── 📄 route.ts
│   │       ├── 📁 authenticate
│   │       │   ├── 📁 debug
│   │       │   ├── 📁 docs
│   │       │   │   └── 📝 authenticate-spec.md
│   │       │   ├── 📁 service
│   │       │   │   └── 📄 authenticate-service.ts
│   │       │   ├── 📁 signin
│   │       │   │   └── 📄 route.ts
│   │       │   ├── 📁 signup
│   │       │   │   └── 📄 route.ts
│   │       │   └── 📁 validation
│   │       │       └── 📄 authenticate-schema.ts
│   │       ├── 📁 blogs
│   │       │   ├── 📁 [blog_id]
│   │       │   │   └── 📄 route.ts
│   │       │   └── 📁 read
│   │       │       └── 📄 route.ts
│   │       ├── 📁 config
│   │       │   └── 📁 options
│   │       │       └── 📄 route.ts
│   │       ├── 📁 employee
│   │       │   ├── 📁 applications
│   │       │   │   ├── 📁 create
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 read
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 application-service.ts
│   │       │   │   └── 📁 validation
│   │       │   │       └── 📄 application-schema.ts
│   │       │   ├── 📁 profile
│   │       │   │   ├── 📁 docs
│   │       │   │   │   ├── 📝 read-spec.md
│   │       │   │   │   └── 📝 update-spec.md
│   │       │   │   ├── 📁 read
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 employee-profile-service.ts
│   │       │   │   ├── 📁 update
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   └── 📁 validation
│   │       │   │       └── 📄 employee-profile-schema.ts
│   │       │   └── 📁 schools
│   │       │       ├── 📁 [school_id]
│   │       │       │   ├── 📁 read
│   │       │       │   │   └── 📄 route.ts
│   │       │       │   ├── 📁 service
│   │       │       │   │   └── 📄 school-profile-service.ts
│   │       │       │   └── 📁 validation
│   │       │       │       └── 📄 school-profile-schema.ts
│   │       │       ├── 📁 read
│   │       │       │   └── 📄 route.ts
│   │       │       ├── 📁 service
│   │       │       │   └── 📄 school-service.ts
│   │       │       └── 📁 validation
│   │       │           └── 📄 school-search-schema.ts
│   │       ├── 📁 employer
│   │       │   ├── 📁 account-setting
│   │       │   │   ├── 📁 change-password
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   └── 📁 update-personal
│   │       │   │       └── 📄 route.ts
│   │       │   ├── 📁 jobs
│   │       │   │   ├── 📁 applicants
│   │       │   │   │   ├── 📁 read
│   │       │   │   │   │   └── 📄 route.ts
│   │       │   │   │   └── 📁 update-status
│   │       │   │   │       └── 📄 route.ts
│   │       │   │   ├── 📁 close
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 create
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 pipeline
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 read
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 job-service.ts
│   │       │   │   ├── 📁 stats
│   │       │   │   │   └── 📁 read
│   │       │   │   │       └── 📄 route.ts
│   │       │   │   ├── 📁 update
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   └── 📁 validation
│   │       │   │       └── 📄 job-schema.ts
│   │       │   ├── 📁 organization
│   │       │   │   ├── 📁 delegated
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 invites
│   │       │   │   │   ├── 📁 accept
│   │       │   │   │   │   └── 📄 route.ts
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 members
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 plan
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 roles
│   │       │   │   │   ├── 📁 permissions
│   │       │   │   │   │   └── 📄 route.ts
│   │       │   │   │   └── 📄 route.ts
│   │       │   │   ├── 📁 service
│   │       │   │   │   └── 📄 org-service.ts
│   │       │   │   └── 📁 validation
│   │       │   │       └── 📄 org-schema.ts
│   │       │   ├── 📁 package
│   │       │   │   └── 📁 read
│   │       │   │       └── 📄 route.ts
│   │       │   └── 📁 profile
│   │       │       ├── 📁 read
│   │       │       │   └── 📄 route.ts
│   │       │       ├── 📁 service
│   │       │       │   └── 📄 employer-profile-service.ts
│   │       │       ├── 📁 update
│   │       │       │   └── 📄 route.ts
│   │       │       └── 📁 validation
│   │       │           └── 📄 employer-profile-schema.ts
│   │       ├── 📁 jobs
│   │       │   ├── 📁 [job_id]
│   │       │   │   └── 📄 route.ts
│   │       │   ├── 📁 latest
│   │       │   │   └── 📄 route.ts
│   │       │   ├── 📁 service
│   │       │   │   └── 📄 job-search-service.ts
│   │       │   ├── 📁 validation
│   │       │   │   └── 📄 job-search-schema.ts
│   │       │   └── 📄 route.ts
│   │       ├── 📁 notifications
│   │       │   ├── 📁 read
│   │       │   │   └── 📄 route.ts
│   │       │   ├── 📁 read-all
│   │       │   │   └── 📄 route.ts
│   │       │   └── 📁 service
│   │       │       └── 📄 notification-service.ts
│   │       └── 📁 storage
│   │           ├── 📁 delete
│   │           │   └── 📄 route.ts
│   │           ├── 📁 service
│   │           │   └── 📄 storage-service.ts
│   │           └── 📁 upload
│   │               └── 📄 route.ts
│   ├── 📁 components
│   │   ├── 📁 card
│   │   │   └── 📄 summary-card.component.tsx
│   │   ├── 📁 layouts
│   │   │   ├── 📁 admin
│   │   │   │   ├── 📄 admin-guard.tsx
│   │   │   │   ├── 📄 admin-layout.tsx
│   │   │   │   ├── 📄 breadcrumb.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 navbar.tsx
│   │   │   │   └── 📄 sidebar.tsx
│   │   │   ├── 📁 landing
│   │   │   │   ├── 📁 _config
│   │   │   │   │   └── 📄 landing-theme.ts
│   │   │   │   ├── 📄 footer.tsx
│   │   │   │   ├── 📄 landing-layout-client.tsx
│   │   │   │   ├── 📄 landing-layout.tsx
│   │   │   │   └── 📄 navbar.tsx
│   │   │   ├── 📁 modal
│   │   │   │   ├── 📄 base-modal.tsx
│   │   │   │   ├── 📄 notification-modal-provider.tsx
│   │   │   │   └── 📄 result-modal.tsx
│   │   │   ├── 📁 signup
│   │   │   └── 📄 layout-selector.tsx
│   │   └── 📁 modal
│   │       └── 📄 modal.component.tsx
│   ├── 📁 contexts
│   │   └── 📄 theme-context.tsx
│   ├── 📁 generated
│   ├── 📁 lib
│   │   ├── 📄 geo.ts
│   │   ├── 📄 storage.ts
│   │   └── 📄 supabase.ts
│   ├── 📁 locales
│   ├── 📁 pages
│   │   ├── 📁 admin
│   │   │   ├── 📁 _api
│   │   │   │   └── 📄 dashboard-api.ts
│   │   │   ├── 📁 _components
│   │   │   │   ├── 📄 activity-table-section.tsx
│   │   │   │   ├── 📄 application-funnel-chart.tsx
│   │   │   │   ├── 📄 job-application-trend-chart.tsx
│   │   │   │   ├── 📄 job-status-donut-chart.tsx
│   │   │   │   ├── 📄 pending-actions-card.tsx
│   │   │   │   ├── 📄 platform-health-chart.tsx
│   │   │   │   ├── 📄 quick-links-section.tsx
│   │   │   │   ├── 📄 recent-signups-card.tsx
│   │   │   │   ├── 📄 role-distribution-chart.tsx
│   │   │   │   ├── 📄 stats-section.tsx
│   │   │   │   ├── 📄 system-health-section.tsx
│   │   │   │   ├── 📄 system-info-section.tsx
│   │   │   │   ├── 📄 user-growth-chart.tsx
│   │   │   │   └── 📄 welcome-section.tsx
│   │   │   ├── 📁 _state
│   │   │   │   └── 📄 dashboard-store.ts
│   │   │   ├── 📁 announcement
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 announcement-api.ts
│   │   │   │   ├── 📁 _components
│   │   │   │   │   ├── 📄 announcement-history.tsx
│   │   │   │   │   └── 📄 broadcast-composer.tsx
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 announcement-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 blog
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 blog-api.ts
│   │   │   │   ├── 📁 _components
│   │   │   │   │   ├── 📄 ai-assistant-panel.tsx
│   │   │   │   │   ├── 📄 blog-analytics-section.tsx
│   │   │   │   │   ├── 📄 blog-editor-drawer.tsx
│   │   │   │   │   ├── 📄 blog-kanban.tsx
│   │   │   │   │   ├── 📄 blog-stats-bar.tsx
│   │   │   │   │   ├── 📄 blog-table.tsx
│   │   │   │   │   └── 📄 seo-checker-panel.tsx
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 blog-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 config
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 config-api.ts
│   │   │   │   ├── 📁 _components
│   │   │   │   │   ├── 📄 add-option-modal.tsx
│   │   │   │   │   ├── 📄 config-table.tsx
│   │   │   │   │   └── 📄 edit-option-modal.tsx
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 config-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 job-management
│   │   │   │   ├── 📁 create
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 edit
│   │   │   │   │   └── 📁 [id]
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   └── 📁 read
│   │   │   │       ├── 📁 _api
│   │   │   │       │   └── 📄 admin-job-api.ts
│   │   │   │       ├── 📁 _components
│   │   │   │       │   ├── 📄 applicant-list.tsx
│   │   │   │       │   ├── 📄 audit-log-drawer.tsx
│   │   │   │       │   ├── 📄 job-detail-drawer.tsx
│   │   │   │       │   ├── 📄 job-filter-bar.tsx
│   │   │   │       │   ├── 📄 job-status-tag.tsx
│   │   │   │       │   ├── 📄 job-table.tsx
│   │   │   │       │   └── 📄 stats-bar.tsx
│   │   │   │       ├── 📁 _state
│   │   │   │       │   └── 📄 admin-job-store.ts
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📁 package-management
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 package-api.ts
│   │   │   │   ├── 📁 _components
│   │   │   │   │   ├── 📄 bulk-plan-modal.tsx
│   │   │   │   │   ├── 📄 plan-change-modal.tsx
│   │   │   │   │   ├── 📄 plan-form-modal.tsx
│   │   │   │   │   ├── 📄 quota-alert-panel.tsx
│   │   │   │   │   ├── 📄 revenue-projection-panel.tsx
│   │   │   │   │   └── 📄 school-detail-drawer.tsx
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 package-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 user-management
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 user-management-api.ts
│   │   │   │   ├── 📁 _components
│   │   │   │   │   ├── 📄 bulk-action-section.tsx
│   │   │   │   │   ├── 📄 filter-section.tsx
│   │   │   │   │   ├── 📄 header-section.tsx
│   │   │   │   │   ├── 📄 stats-section.tsx
│   │   │   │   │   ├── 📄 summary-section.tsx
│   │   │   │   │   ├── 📄 user-detail-drawer.tsx
│   │   │   │   │   └── 📄 user-table.tsx
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 user-management-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 blog
│   │   │   ├── 📁 [blog_id]
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 _api
│   │   │   │   └── 📄 blog-api.ts
│   │   │   ├── 📁 _state
│   │   │   │   └── 📄 blog-store.ts
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 employee
│   │   │   ├── 📁 account-setting
│   │   │   │   ├── 📁 components
│   │   │   │   │   └── 📄 account-setting-form.tsx
│   │   │   │   ├── 📁 stores
│   │   │   │   │   └── 📄 account-setting-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 profile
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 employee-profile-api.ts
│   │   │   │   ├── 📁 _components
│   │   │   │   │   ├── 📄 basic-info-section.tsx
│   │   │   │   │   ├── 📄 education-history-section.tsx
│   │   │   │   │   ├── 📄 education-section.tsx
│   │   │   │   │   ├── 📄 gender-dob-photo-section.tsx
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   ├── 📄 personal-summary-section.tsx
│   │   │   │   │   ├── 📄 profile-edit-drawer.tsx
│   │   │   │   │   ├── 📄 profile-layout.tsx
│   │   │   │   │   ├── 📄 profile-section-wrapper.tsx
│   │   │   │   │   ├── 📄 resume-upload-section.tsx
│   │   │   │   │   ├── 📄 section-form.tsx
│   │   │   │   │   ├── 📄 skills-location-section.tsx
│   │   │   │   │   ├── 📄 specialization-section.tsx
│   │   │   │   │   ├── 📄 teaching-info-section.tsx
│   │   │   │   │   ├── 📄 teaching-license-section.tsx
│   │   │   │   │   ├── 📄 teaching-skills-section.tsx
│   │   │   │   │   └── 📄 work-experience-section.tsx
│   │   │   │   ├── 📁 _stores
│   │   │   │   │   └── 📄 profile-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 school
│   │   │       ├── 📁 _api
│   │   │       │   └── 📄 school-api.ts
│   │   │       ├── 📁 _components
│   │   │       │   ├── 📄 school-card.tsx
│   │   │       │   ├── 📄 school-jobs-drawer.tsx
│   │   │       │   └── 📄 school-search.tsx
│   │   │       ├── 📁 _stores
│   │   │       │   └── 📄 school-store.ts
│   │   │       ├── 📁 profile
│   │   │       │   └── 📁 [school_id]
│   │   │       │       ├── 📁 _api
│   │   │       │       │   └── 📄 school-profile-api.ts
│   │   │       │       ├── 📁 _components
│   │   │       │       │   ├── 📄 open-jobs-section.tsx
│   │   │       │       │   ├── 📄 school-benefits-section.tsx
│   │   │       │       │   ├── 📄 school-info-section.tsx
│   │   │       │       │   └── 📄 school-profile-header.tsx
│   │   │       │       ├── 📁 _state
│   │   │       │       │   └── 📄 school-profile-store.ts
│   │   │       │       └── 📄 page.tsx
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 employer
│   │   │   ├── 📁 account-setting
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 account-setting-api.ts
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 account-setting-store.ts
│   │   │   │   ├── 📁 components
│   │   │   │   │   ├── 📄 account-setting-form.tsx
│   │   │   │   │   └── 📄 package-section.tsx
│   │   │   │   ├── 📁 stores
│   │   │   │   │   └── 📄 account-setting-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 delegated-access
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 delegated-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 job
│   │   │   │   ├── 📁 post
│   │   │   │   │   ├── 📁 [id]
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 _api
│   │   │   │   │   │   └── 📄 job-post-api.ts
│   │   │   │   │   ├── 📁 _components
│   │   │   │   │   │   ├── 📄 basic-info-section.tsx
│   │   │   │   │   │   ├── 📄 job-detail-section.tsx
│   │   │   │   │   │   ├── 📄 job-tips-sidebar.tsx
│   │   │   │   │   │   ├── 📄 location-section.tsx
│   │   │   │   │   │   ├── 📄 post-job-skeleton.tsx
│   │   │   │   │   │   ├── 📄 post-settings-section.tsx
│   │   │   │   │   │   └── 📄 salary-section.tsx
│   │   │   │   │   ├── 📁 _stores
│   │   │   │   │   │   └── 📄 job-post-store.ts
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📁 read
│   │   │   │       ├── 📁 _api
│   │   │   │       │   └── 📄 job-read-api.ts
│   │   │   │       ├── 📁 _components
│   │   │   │       │   ├── 📄 applicant-drawer.tsx
│   │   │   │       │   ├── 📄 applicant-profile-modal.tsx
│   │   │   │       │   ├── 📄 filter-section.tsx
│   │   │   │       │   ├── 📄 insights-card.tsx
│   │   │   │       │   ├── 📄 job-stats-modal.tsx
│   │   │   │       │   ├── 📄 jobs-table.tsx
│   │   │   │       │   ├── 📄 my-jobs-skeleton.tsx
│   │   │   │       │   ├── 📄 package-banner.tsx
│   │   │   │       │   └── 📄 stats-section.tsx
│   │   │   │       ├── 📁 _state
│   │   │   │       │   ├── 📄 applicant-drawer-store.ts
│   │   │   │       │   ├── 📄 job-read-store.ts
│   │   │   │       │   └── 📄 job-stats-modal-store.ts
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📁 profile
│   │   │   │   ├── 📁 _api
│   │   │   │   │   └── 📄 school-profile.api.ts
│   │   │   │   ├── 📁 _components
│   │   │   │   │   ├── 📄 profile-edit-drawer.tsx
│   │   │   │   │   ├── 📄 school-info-tab.tsx
│   │   │   │   │   ├── 📄 school-jobs-tab.tsx
│   │   │   │   │   ├── 📄 school-profile-header.tsx
│   │   │   │   │   ├── 📄 school-profile-sidebar.tsx
│   │   │   │   │   ├── 📄 school-profile-skeleton.tsx
│   │   │   │   │   └── 📄 statistic-item.tsx
│   │   │   │   ├── 📁 _state
│   │   │   │   │   └── 📄 school-profile.state.ts
│   │   │   │   ├── 📁 _stores
│   │   │   │   │   └── 📄 school-profile-store.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 school-management
│   │   │       ├── 📁 _api
│   │   │       │   └── 📄 org-api.ts
│   │   │       ├── 📁 _components
│   │   │       │   └── 📄 rbac-tab.tsx
│   │   │       ├── 📁 _state
│   │   │       │   └── 📄 org-store.ts
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 job
│   │   │   ├── 📁 [job_id]
│   │   │   │   └── 📁 apply
│   │   │   │       ├── 📁 _api
│   │   │   │       │   └── 📄 apply-api.ts
│   │   │   │       ├── 📁 _components
│   │   │   │       │   ├── 📄 document-section.tsx
│   │   │   │       │   ├── 📄 job-summary.tsx
│   │   │   │       │   └── 📄 user-profile-card.tsx
│   │   │   │       ├── 📁 _state
│   │   │   │       │   └── 📄 apply-store.ts
│   │   │   │       ├── 📁 _stores
│   │   │   │       │   └── 📄 apply-store.ts
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📁 _api
│   │   │   │   └── 📄 job-search-api.ts
│   │   │   ├── 📁 _components
│   │   │   │   ├── 📄 application-tracker-drawer.tsx
│   │   │   │   ├── 📄 job-card.tsx
│   │   │   │   ├── 📄 job-detail-drawer.tsx
│   │   │   │   ├── 📄 job-list-section.tsx
│   │   │   │   ├── 📄 search-filter-section.tsx
│   │   │   │   └── 📄 sidebar-section.tsx
│   │   │   ├── 📁 _state
│   │   │   │   ├── 📄 application-tracker-store.ts
│   │   │   │   ├── 📄 job-search-store.ts
│   │   │   │   └── 📄 saved-jobs-store.ts
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 landing
│   │   │   ├── 📁 _api
│   │   │   │   └── 📄 landing-api.ts
│   │   │   ├── 📁 _components
│   │   │   │   ├── 📄 employer-section.tsx
│   │   │   │   ├── 📄 hero-section.tsx
│   │   │   │   ├── 📄 job-seeker-section.tsx
│   │   │   │   └── 📄 latest-jobs-section.tsx
│   │   │   ├── 📁 _state
│   │   │   │   └── 📄 landing-store.ts
│   │   │   ├── 📁 stores
│   │   │   │   └── 📄 landing-search-store.ts
│   │   │   ├── ⚙️ mock-up-data.json
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 signin
│   │   │   ├── 📁 _api
│   │   │   │   └── 📄 signin-api.ts
│   │   │   ├── 📁 _components
│   │   │   │   ├── 📄 signin-branding-panel.tsx
│   │   │   │   └── 📄 signin-form.tsx
│   │   │   ├── 📁 _state
│   │   │   │   └── 📄 signin-store.ts
│   │   │   └── 📄 page.tsx
│   │   └── 📁 signup
│   │       ├── 📁 _api
│   │       │   └── 📄 signup-api.ts
│   │       ├── 📁 _components
│   │       │   ├── 📄 branding-panel.tsx
│   │       │   └── 📄 signup-form.tsx
│   │       ├── 📁 _state
│   │       │   └── 📄 signup-store.ts
│   │       └── 📄 page.tsx
│   ├── 📁 stores
│   │   ├── 📄 auth-store.ts
│   │   └── 📄 notification-modal-store.ts
│   ├── 📁 styles
│   │   └── 🎨 globals.css
│   ├── 📄 favicon.ico
│   ├── 📄 layout.tsx
│   ├── 📄 not-found.tsx
│   └── 📄 page.tsx
├── 📁 lib
│   ├── 📄 mailer.ts
│   ├── 📄 notification.ts
│   ├── 📄 prisma.ts
│   └── 📄 utils.ts
├── 📁 playwright-report
│   ├── 📁 data
│   │   ├── 📝 6ee1b95b501d4b0b7d17a65603ed7596bc0fd175.md
│   │   ├── 🖼️ 9c237e06c6c8892948a025798bf69624eadc55b8.png
│   │   ├── 🖼️ f2de32d9e42944039ff7161a3deca396662ffdd2.png
│   │   └── 📝 ffa794d7bd09f166c577faf3a40e52c5b2e3d18b.md
│   └── 🌐 index.html
├── 📁 prisma
│   ├── 📁 migrations
│   │   ├── 📁 20250309000000_add_work_education_models
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20260307154733_rename_to_snake_case
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 20260307165023_add_password_to_profile
│   │   │   └── 📄 migration.sql
│   │   ├── 📁 update_profile_fields
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   ├── 📄 schema.prisma
│   ├── 📄 seed-config.ts
│   └── 📄 seed.ts
├── 📁 public
│   ├── 📁 images
│   │   └── 📁 flat
│   │       ├── 🖼️ undraw_about-me_5990.svg
│   │       ├── 🖼️ undraw_add-file_lf11.svg
│   │       ├── 🖼️ undraw_click-here_3vzn.svg
│   │       ├── 🖼️ undraw_hire_hadq.svg
│   │       ├── 🖼️ undraw_hiring_8szx.svg
│   │       ├── 🖼️ undraw_interview_yz52.svg
│   │       ├── 🖼️ undraw_job-offers_55y0.svg
│   │       ├── 🖼️ undraw_my-resume_etai.svg
│   │       ├── 🖼️ undraw_online-cv_4iq9.svg
│   │       ├── 🖼️ undraw_online-information_hhp2.svg
│   │       ├── 🖼️ undraw_online-resume_z4sp.svg
│   │       ├── 🖼️ undraw_personal-information_h7kf.svg
│   │       ├── 🖼️ undraw_portfolio-update_6bro.svg
│   │       ├── 🖼️ undraw_professional-card_ldgq.svg
│   │       ├── 🖼️ undraw_profile_d7qw.svg
│   │       ├── 🖼️ undraw_project-completed_ug9i.svg
│   │       ├── 🖼️ undraw_resume-folder_hf4p.svg
│   │       ├── 🖼️ undraw_resume_jrgi.svg
│   │       ├── 🖼️ undraw_screening-resumes_dh9s.svg
│   │       ├── 🖼️ undraw_social-bio_2xzi.svg
│   │       ├── 🖼️ undraw_starting-work_ifnt.svg
│   │       ├── 🖼️ undraw_updated-resume_287i.svg
│   │       ├── 🖼️ undraw_web-search_7oif copy.svg
│   │       └── 🖼️ undraw_web-search_7oif.svg
│   ├── 🖼️ file.svg
│   ├── 🖼️ globe.svg
│   ├── 🖼️ next.svg
│   ├── 📄 sw.js
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
├── 📁 test-results
│   ├── 📁 auth-auth-flow-Authenticat-4d380-er-School-Signup-Login-Flow-chromium
│   │   ├── 📝 error-context.md
│   │   └── 🖼️ test-failed-1.png
│   ├── 📁 auth-auth-flow-Authenticat-5fc01-e-Teacher-Signup-Login-Flow-chromium
│   │   ├── 📝 error-context.md
│   │   └── 🖼️ test-failed-1.png
│   └── ⚙️ .last-run.json
├── 📁 tests
│   └── 📁 auth
│       └── 📄 auth-flow.spec.ts
├── ⚙️ .gitignore
├── 📝 CLAUDE.md
├── 📝 README.md
├── 📄 bun.lock
├── 📄 eslint.config.mjs
├── ⚙️ netlify.toml
├── 📄 next.config.ts
├── ⚙️ package.json
├── 📄 playwright.config.ts
├── 📄 postcss.config.mjs
├── 📄 prisma.config.ts
└── ⚙️ tsconfig.json
```

---

_Generated by FileTree Pro Extension_
