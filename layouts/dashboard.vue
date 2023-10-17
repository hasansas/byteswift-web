<template>
  <v-app>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-app-bar
      flat
      :clipped-left="clipped"
      fixed
      app
      color="white"
      style="
        border-width: 0 0 1px !important;
        border-style: solid;
        border-color: #eee !important;
      "
    >
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <!-- <v-btn icon>
        <v-icon>ri-menu-2-line </v-icon>
      </v-btn> -->
      <v-toolbar-title class="d-flex">
        <NuxtLink class="d-flex brand-logo ma-0" to="/">
          <img height="24" src="~/assets/img/logo.png" />
        </NuxtLink>
      </v-toolbar-title>
      <v-spacer />
      <div class="mx-4 text-capitalize">
        Hi,
        <span class="font-weight-lightg">{{ user.name }}</span>
      </div>
      <!-- Settings -->
      <v-menu nudge-bottom="9" nudge-right="20" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            depressed
            fab
            color="white"
            height="42"
            width="42"
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar color="white" size="42px">
              <v-avatar size="38px" color="accent">
                <v-img
                  v-if="user.image.url !== null"
                  :aspect-ratio="1 / 1"
                  :src="user.image.url"
                ></v-img>
                <v-icon v-else size="16" color="white"> ri-user-3-line </v-icon>
              </v-avatar>
            </v-avatar>
          </v-btn>
        </template>
        <v-card tile>
          <v-list>
            <v-list-item-group>
              <v-list-item to="/profile" class="pr-10">
                <v-list-item-icon class="mr-4">
                  <v-icon size="20">ri-user-settings-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/settings" class="pr-10">
                <v-list-item-icon class="mr-4">
                  <v-icon size="20">ri-settings-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="pr-10" @click="logout">
                <v-list-item-icon class="mr-4">
                  <v-icon size="20">ri-logout-circle-line</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main v-if="userLoaded">
      <Nuxt />
    </v-main>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <!-- <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  middleware: "auth",
  name: "DefaultLayout",
  head: {
    script: [{ src: "https://edge.xero.com/platform/sso/xero-sso.js" }],
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "ByteSwift",
      userLoaded: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "users/user",
    }),
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("theme", this.$vuetify.theme.dark.toString());
    },
    async getUser() {
      await this.$store.dispatch("users/me");

      this.userLoaded = true;
    },
    async logout() {
      // logout user
      await this.$store.dispatch("users/logout");

      // redirect to login page
      this.$router.push({
        path: "/login",
      });
    },
  },
  mounted() {
    // get user
    this.getUser();

    // get theme
    const theme = localStorage.getItem("theme");
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
      } else this.$vuetify.theme.dark = false;
    }
  },
};
</script>

<style lang="sass">
@import "~/assets/style.sass"
</style>