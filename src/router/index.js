import { createRouter, createWebHistory } from 'vue-router'
import SplashPage from '../views/SplashPage.vue'
import LoginOtp from '../views/LoginOtp.vue'
import LoginPhone from '../views/LoginPhone.vue'
import SignupPage from '@/views/SignupPage.vue'
import HomePage from '@/views/HomePage.vue'
import SubcategoryPage from '@/views/SubcategoryPage.vue'
import PrivateQuestion from '@/views/PrivateQuestion.vue'
import PublicQuestion from '@/views/PublicQuestion.vue'
import AddAddress from '@/views/AddAddress.vue'
import SupportPage from '@/views/SupportPage.vue'
import MyTicket from '@/views/MyTicket.vue'
import UserArea from '@/views/UserArea.vue'
import MyProfile from '@/views/MyProfile.vue'
import MyAddress from '@/views/MyAddress.vue'
import MyWallet from '@/views/MyWallet.vue'
import MyCart from '@/views/MyCart.vue'
import FAQPage from '@/views/FAQPage.vue'
import RulesPage from '@/views/RulesPage.vue'
import AboutUsPage from '@/views/AboutUsPage.vue'
import PrivacyPage from '@/views/PrivacyPage.vue'
import OrdersPage from '@/views/OrdersPage.vue'
import ShowFactor from '@/views/ShowFactor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'SplashPage',
      component: SplashPage,
    },
    {
      path: '/login_phone',
      name: 'LoginPhone',
      component: LoginPhone,
    },
    {
      path: '/login_otp/:phone/:otp',
      name: 'LoginOtp',
      component: LoginOtp,
    },
    {
      path: '/signup_page/:phone',
      name: 'SignupPage',
      component: SignupPage,
    },
    {
      path: '/home_page',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/subcategory_page/:id',
      name: 'SubcategoryPage',
      component: SubcategoryPage,
    },

    {
      path: '/private_question/:id/:parentId',
      name: 'PrivateQuestion',
      component: PrivateQuestion,
    },
    {
      path: '/public_question/:id/:parentId',
      name: 'PublicQuestion',
      component: PublicQuestion,
    },

    {
      path: '/add_address',
      name: 'AddAddress',
      component: AddAddress,
    },

    {
      path: '/support_page',
      name: 'SupportPage',
      component: SupportPage,
    },

    {
      path: '/my_ticket',
      name: 'MyTicket',
      component: MyTicket,
    },

    {
      path: '/user_area',
      name: 'UserArea',
      component: UserArea,
    },

    {
      path: '/my_profile',
      name: 'MyProfile',
      component: MyProfile,
    },

    {
      path: '/my_address',
      name: 'MyAddress',
      component: MyAddress,
    },

    {
      path: '/my_wallet',
      name: 'MyWallet',
      component: MyWallet,
    },

    {
      path: '/my_cart',
      name: 'MyCart',
      component: MyCart,
    },

    {
      path: '/FAQ_page',
      name: 'FAQPage',
      component: FAQPage,
    },
    {
      path: '/rules_page',
      name: 'RulesPage',
      component: RulesPage,
    },
    {
      path: '/about_us_page',
      name: 'AboutUsPage',
      component: AboutUsPage,
    },
    {
      path: '/privacy_page',
      name: 'PrivacyPage',
      component: PrivacyPage,
    },

    {
      path: '/orders_page',
      name: 'OrdersPage',
      component: OrdersPage,
    },

    {
      path: '/show_factor/:order_id/',
      name: 'ShowFactor',
      component: ShowFactor,
    },

  ],
})

export default router
