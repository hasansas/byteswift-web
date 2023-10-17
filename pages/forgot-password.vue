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
          <div class="login-content">
            <v-card-title class="d-flex justify-center py-0 mt-8">
              Forgot Your Password?
            </v-card-title>
            <v-card-subtitle v-if="showForm" class="text-center px-8 py-0 mt-6">
              Enter your email address to reset your password. You may need to
              check your spam folder.
            </v-card-subtitle>
            <v-card-subtitle v-else class="text-center px-8 py-0 mt-6">
              Your reset password request has been sent. An email has been sent
              to your email address that your VemoBlast account registered with.
            </v-card-subtitle>

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

              <v-form v-if="showForm" @submit.stop.prevent="forgotPassword">
                <!-- email * -->
                <v-text-field
                  v-model="form.email"
                  id="email"
                  type="email"
                  :rules="rules.email"
                  label="Email"
                  placeholder="john@example.com"
                  :disabled="disabledForm"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="mr-4">ri-at-line</v-icon>
                  </template>
                </v-text-field>
                <v-btn
                  v-if="showForm"
                  type="submit"
                  color="primary"
                  depressed
                  ripple
                  large
                  block
                  :loading="disabledForm"
                  :disabled="form.email === ''"
                  class="btn-submit mt-4"
                >
                  RESET MY PASSWORD
                </v-btn>
              </v-form>
            </v-card-text>
          </div>
        </v-card>

        <div class="text-center my-6">
          <span class="text--opacity">Back to</span>
          <NuxtLink to="/login"> Login </NuxtLink>
        </div>

        <!-- Snackbar -->
        <v-snackbar
          v-model="snackbar.show"
          :timeout="5000"
          :color="snackbar.color"
        >
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="white"
              text
              v-bind="attrs"
              @click="snackbar.show = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "none",
  middleware: "login",
  head: {
    title: "Forgot password",
  },
  data() {
    return {
      showForm: true,
      form: {
        error: false,
        errorMsg: "",
        email: "",
      },
      disabledForm: false,
      rules: {
        email: [
          (v) => !!v || "E-mail is required",
          (v) =>
            /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || "E-mail must be valid",
        ],
      },
      snackbar: {
        show: false,
        text: "",
        color: null,
      },
    };
  },
  methods: {
    async forgotPassword() {
      // disable form
      this.disabledForm = true;

      // forgot password
      const _forgotPassword = await this.$store.dispatch(
        "users/forgotPassword",
        {
          email: this.form.email,
        }
      );

      // enable form
      this.disabledForm = false;
      this.form.error = false;
      this.form.errorMsg = "";

      // handle error
      if (!_forgotPassword.success) {
        const data = _forgotPassword.data;
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

      // show success card
      this.showForm = false;
      this.form.errorMsg = "";
      this.form.error = false;
    },
  },
};
</script>