import FamilyTreeController from './FamilyTreeController'
import PendingApprovalController from './PendingApprovalController'
import DashboardController from './DashboardController'
import ActivityLogController from './ActivityLogController'
import FamilyMemberController from './FamilyMemberController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    FamilyTreeController: Object.assign(FamilyTreeController, FamilyTreeController),
PendingApprovalController: Object.assign(PendingApprovalController, PendingApprovalController),
DashboardController: Object.assign(DashboardController, DashboardController),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
FamilyMemberController: Object.assign(FamilyMemberController, FamilyMemberController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers