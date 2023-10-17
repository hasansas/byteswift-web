<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col>
        <div class="d-flex justify-center align-center mb-16">
          <img height="32" src="~/assets/img/logo.png" />
        </div>
        <v-card
          width="440"
          class="mx-auto"
          rounded="xl"
          flat
          outlined
          :loading="disabledForm"
        >
          <template slot="progress">
            <v-progress-linear
              color="primary"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title class="d-flex justify-center py-0 mt-8">
            Sign Into Your Account
          </v-card-title>

          <v-card-text class="pa-8">
            <!-- error message -->
            <v-alert
              v-if="form.error"
              text
              icon="ri-notification-3-line"
              type="error"
              class="mb-8"
            >
              {{ form.errorMsg }}
            </v-alert>

            <v-form @submit.stop.prevent="login" ref="loginForm" class="mt-4">
              <!-- email * -->
              <v-text-field
                v-model="form.email"
                id="login_email"
                type="email"
                :rules="rules.email"
                :error-messages="form.errorMessages"
                label="Email"
                placeholder="john@example.com"
                required
                :disabled="disabledForm"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-at-line</v-icon>
                </template>
              </v-text-field>

              <!-- Password * -->
              <v-text-field
                id="login_password"
                v-model="form.password"
                type="password"
                :rules="rules.password"
                :error-messages="form.errorMessages"
                label="Password"
                :append-icon="
                  showLoginPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                @click:append="togglePassword('login_password')"
                required
                :disabled="disabledForm"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-key-line</v-icon>
                </template>
              </v-text-field>
              <div class="d-flex justify-end mb-8">
                <NuxtLink to="/forgot-password"> Forgot password? </NuxtLink>
              </div>
              <!-- btn login -->
              <v-btn
                type="submit"
                color="primary"
                depressed
                ripple
                large
                block
                :loading="disabledForm"
                class="btn-submit"
              >
                LOGIN
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <div class="text-center mt-12">
          <span class="text--opacity">Don't have an account?</span>
          <NuxtLink to="/register"> Register </NuxtLink>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "none",
  middleware: "login",
  head: {
    title: "Login",
  },
  data() {
    return {
      form: {
        error: false,
        errorMsg: "sss",
        email: "",
        password: "",
      },
      rules: {
        email: [
          (v) => !!v || "E-mail is required",
          (v) =>
            /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || "E-mail must be valid",
        ],
        password: [(v) => !!v || "Name is required"],
      },
      showLoginPassword: false,
      disabledForm: false,
      snackbar: {
        show: false,
        text: "",
        color: null,
      },
    };
  },
  methods: {
    togglePassword(elId) {
      var el = document.getElementById(elId);
      if (el.type === "password") {
        el.type = "text";
      } else {
        el.type = "password";
      }
      if (elId == "login_password") {
        this.showLoginPassword = !this.showLoginPassword;
      }
    },
    async login() {
      const vm = this;

      if (!this.$refs.loginForm.validate()) return;

      // disable form
      this.disabledForm = true;

      // login user
      const _login = await this.$store.dispatch("users/login", {
        input: this.form,
      });

      // enable form
      this.disabledForm = false;
      this.form.error = false;
      this.form.errorMsg = "";

      // handle error
      if (!_login.success) {
        const data = _login.data;
        let message = data.message;

        if (typeof data.error !== "undefined" && Array.isArray(data.error)) {
          message = "";
          for (let index = 0; index < data.error.length; index++) {
            const err = data.error[index];
            message += `${err.param} ${err.msg}, `;
          }
          message = message.substring(0, message.length - 2);
        }

        this.form.errorMsg = message;
        this.form.error = true;
        return;
      }

      // go to dashboard
      this.$router.push({
        path: "/",
      });
    },
  },
};
</script>