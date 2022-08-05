import React, { lazy } from 'react'
import { Redirect } from 'react-router-dom'
import DashboardLayout from 'src/layouts/DashboardLayout'
import HomeLayout from 'src/layouts/HomeLayout'

export const routes = [
  {
    exact: true,
    path: '/',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Dashboard/index')),
  },
  {
    exact: true,
    path: '/login',
    // layout: DashboardLayout,
    component: lazy(() => import('src/views/pages/Login')),
  },
  {
    exact: true,
    path: '/forgot-password',
    // layout: DashboardLayout,
    component: lazy(() => import('src/views/pages/ForgotPassword')),
  },
  {
    exact: true,
    path: '/reset-password',
    // layout: DashboardLayout,
    component: lazy(() => import('src/views/pages/ResetPassword')),
  },
  {
    exact: true,
    path: '/popup',
    // layout: DashboardLayout,
    component: lazy(() => import('src/views/pages/Users/Pop')),
  },

  {
    exact: true,
    path: '/AddAdmin',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Users/Admin/AddAdmin')),
  },
  {
    exact: true,
    path: '/Userview',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Userview')),
  },
  {
    exact: true,
    path: '/User',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Users/index')),
  },
  {
    exact: true,
    path: '/SearchResult',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Users/Searchresult')),
  },
  {
    exact: true,
    path: '/setting',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Setting/index')),
  },
  {
    exact: true,
    path: '/NFT-detail',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/NFTDetail/index')),
  },
  {
    exact: true,
    path: '/Termsof',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Staticmanagement/index')),
  },
  {
    exact: true,
    path: '/chat',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/Setting/Chat')),
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFound')),
  },
  {
    exact: true,
    path: '/userimg',
    guard: true,
    component: lazy(() => import('src/component/User')),
  },
  {
    exact: true,
    path: '/press-nft',
    // guard: true,
    component: lazy(() => import('src/views/pages/Home/PressNft')),
  },
  {
    exact: true,
    path: '/Press',
    // guard: true,
    component: lazy(() => import('src/views/pages/Home/Press')),
  },
  {
    exact: true,
    path: '/static-content-management',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/StaticContent')),
  },
  {
    exact: true,
    path: '/landing',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingBanner/BannerLIsting'),
    ),
  },
  {
    exact: true,
    path: '/banner-landing',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingPageManagement/BannerSections'),
    ),
  },
  {
    exact: true,
    path: '/oursolutions',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingPageManagement/OurSolutions'),
    ),
  },
  {
    exact: true,
    path: '/how-it-works',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingPageManagement/HowItWorks'),
    ),
  },
  {
    exact: true,
    path: '/landingpage-management',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingPageManagement/ContentList'),
    ),
  },
  {
    exact: true,
    path: '/banner',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/Banner')),
  },
  {
    exact: true,
    path: '/view-static',
    // guard:true,
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/viewStatic'),
    ),
  },
  {
    exact: true,
    path: '/view-socail',
    // guard:true,
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/ViewSocial'),
    ),
  },
  {
    exact: true,
    path: '/edit-static',
    // guard:true,
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/editStatic'),
    ),
  },
  {
    exact: true,
    path: '/edit-social',
    // guard:true,
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/EditSocial'),
    ),
  },
  {
    exact: true,
    path: '/banner-managment',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/bannerManagment/bannerManegment'),
    ),
  },
  {
    exact: true,
    path: '/referral-managment',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/ReferralManagment/Referral')),
  },
  {
    exact: true,
    path: '/sub-admin',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/SubAdmin/SubAdminList')),
  },
  {
    exact: true,
    path: '/add-banner',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/bannerManagment/Bannercomponent'),
    ),
  },
  {
    exact: true,
    path: '/add-background',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingBanner/AddBackground'),
    ),
  },
  {
    exact: true,
    path: '/add-background-video',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingBanner/AddBannerVideo'),
    ),
  },
  {
    exact: true,
    path: '/add-subAdmin',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/SubAdmin/AddSubAdmin')),
  },
  {
    exact: true,
    path: '/view-banner',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/bannerManagment/view-banner'),
    ),
  },
  {
    exact: true,
    path: '/edit-banner',
    // guard:true,
    component: lazy(() =>
      import('src/views/pages/bannerManagment/editManagement'),
    ),
  },
  {
    exact: true,
    path: '/view-transaction',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/Users/viewUserTransaction')),
  },
  {
    exact: true,
    path: '/user-management',
    // guard:true,
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/Users/UserMangementDetails')),
  },

  {
    component: () => <Redirect to="/404" />,
  },
  // {
  //   exact: true,
  //   path: "/Press",
  //   // guard: true,
  //   layout: HomeLayout,
  //   component: lazy(() => import("src/views/pages/Home/Press")),
  // },
]
