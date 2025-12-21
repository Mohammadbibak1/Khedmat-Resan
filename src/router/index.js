import { createRouter, createWebHistory } from 'vue-router'
import SplashPage from '../views/SplashPage.vue'
import LoginOtp from '../views/LoginOtp.vue'
import LoginPhone from '../views/LoginPhone.vue'
import SignupPage from '@/views/SignupPage.vue'
import HomePage from '@/views/HomePage.vue'
import SupportPage from '@/views/SupportPage.vue'
import MyTicket from '@/views/MyTicket.vue'
import UserArea from '@/views/UserArea.vue'
import MyProfile from '@/views/MyProfile.vue'
import MyWallet from '@/views/MyWallet.vue'
import MyCart from '@/views/MyCart.vue'
import FAQPage from '@/views/FAQPage.vue'
import RulesPage from '@/views/RulesPage.vue'
import AboutUsPage from '@/views/AboutUsPage.vue'
import PrivacyPage from '@/views/PrivacyPage.vue'
import OrdersPage from '@/views/OrdersPage.vue'


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

  ],
})

export default router
