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
            Register for create an account
          </v-card-title>

          <v-card-text class="pa-8">
            <!-- error message -->
            <v-alert
              v-if="forms.error"
              text
              icon="ri-notification-3-line"
              type="error"
              class="mb-8"
            >
              {{ forms.errorMsg }}
            </v-alert>

            <v-form
              v-if="forms.isRegister"
              @submit.stop.prevent="register"
              ref="registerForm"
              class="mt-4"
            >
              <!-- name * -->
              <v-text-field
                v-model="forms.register.name"
                id="name"
                :rules="[
                  () => !!forms.register.name || 'This field is required',
                ]"
                :error-messages="forms.register.errorMessages"
                label="Your name"
                placeholder="John Sas"
                :disabled="disabledForm"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-user-line</v-icon>
                </template>
              </v-text-field>

              <!-- email * -->
              <v-text-field
                v-model="forms.register.email"
                id="email"
                type="email"
                :rules="rules.email"
                :error-messages="forms.register.errorMessages"
                label="Email"
                placeholder="john@example.com"
                :disabled="disabledForm"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-at-line</v-icon>
                </template>
              </v-text-field>

              <!-- Password * -->
              <v-text-field
                id="password"
                v-model="forms.register.password"
                type="password"
                :rules="[
                  () => !!forms.register.password || 'This field is required',
                ]"
                :error-messages="forms.register.errorMessages"
                label="Password"
                :append-icon="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append="togglePassword('password')"
                :disabled="disabledForm"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-lock-password-line</v-icon>
                </template>
              </v-text-field>

              <!-- Confirm Password * -->
              <v-text-field
                id="confirm_password"
                v-model="forms.register.confirm_password"
                type="password"
                :rules="rules.confirmPasswordRules"
                :error-messages="forms.register.errorMessages"
                label="Retype password"
                :append-icon="
                  showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                @click:append="togglePassword('confirm_password')"
                :disabled="disabledForm"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-lock-2-line</v-icon>
                </template>
              </v-text-field>
              <v-checkbox
                v-model="forms.isAgreeTerms"
                ripple
                hide-details
                class="mb-8 d-inline-block"
              >
                <template v-slot:label>
                  <div class="ml-3">
                    i have read and agree to Bytswift's
                    <span class="primary--text" @click="showPrivacyPolicy">
                      privacy policy
                    </span>
                  </div>
                </template>
              </v-checkbox>
              <v-btn
                v-if="forms.isRegister"
                type="submit"
                color="primary"
                depressed
                ripple
                large
                block
                :loading="disabledForm"
                :disabled="
                  forms.register.name === '' ||
                  forms.register.email === '' ||
                  forms.register.password === '' ||
                  forms.register.confirm_password === '' ||
                  forms.isAgreeTerms === false
                "
                class="btn-submit"
              >
                SIGN UP
              </v-btn>
            </v-form>

            <v-form v-else @submit.stop.prevent="confirmRegistration">
              <div class="text-center mt-4 mb-8">
                <p>
                  <span>A confirmation code has been sent to your</span>
                  <span v-if="forms.notifications.whatsapp.sent">
                    Whatsapp
                    <strong>
                      ({{ forms.notifications.whatsapp.number }})
                    </strong>
                  </span>
                  <span v-if="forms.notifications.email.sent">
                    <span>and</span> email
                    <strong> ({{ forms.notifications.email.address }}) </strong>
                  </span>
                </p>
                <p>Please enter the code below to confirm your registration</p>
              </div>
              <v-otp-input
                v-model="forms.confirmation.code"
                length="6"
              ></v-otp-input>

              <v-alert
                v-if="forms.error"
                dense
                outlined
                type="error"
                class="mt-4"
              >
                {{ forms.errorMsg }}
              </v-alert>
              <v-btn
                type="submit"
                color="primary"
                depressed
                ripple
                large
                block
                :loading="disabledForm"
                :disabled="forms.confirmation.code.length < 6"
                class="btn-submit mt-6"
              >
                CONFIRM
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <div class="text-center my-6">
          <span class="text--opacity">If you have an account You can</span>
          <NuxtLink to="/login"> Sign In </NuxtLink>
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
import Convert from "~/helpers/convert.js";
import form from "~/libs/form";

export default {
  layout: "none",
  middleware: "login",
  head: {
    title: "Register",
  },
  data() {
    return {
      forms: {
        isRegister: true,
        error: false,
        errorMsg: "",
        register: {
          name: "",
          email: "",
          waNumber: "",
          countryCode: "ID",
          password: "",
          confirm_password: "",
        },
        confirmation: {
          code: "",
        },
        notifications: {
          email: {
            sent: false,
            address: "",
          },
          whatsapp: {
            sent: false,
            number: "",
          },
          telegram: {
            sent: false,
          },
        },
        isAgreeTerms: false,
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
        confirmPasswordRules: [
          (v) => !!v || "This field is required",
          (v) => v == this.forms.register.password || "Password does not match",
        ],
      },
      showPassword: false,
      showConfirmPassword: false,
      disabledForm: false,
      snackbar: {
        show: false,
        text: "",
        color: null,
      },
    };
  },
  methods: {
    showPrivacyPolicy() {
      console.log("privacy");
    },
    togglePassword(elId) {
      var el = document.getElementById(elId);
      if (el.type === "password") {
        el.type = "text";
      } else {
        el.type = "password";
      }
      if (elId == "password") {
        this.showPassword = !this.showPassword;
      }
      if (elId == "confirm_password") {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    },
    async register() {
      // validate form
      if (!this.$refs.registerForm.validate()) return;

      // disable form
      this.disabledForm = true;
      this.forms.error = false;
      this.forms.errorMsg = "";

      // register user
      const registerUser = await this.$store.dispatch("users/register", {
        input: this.forms.register,
      });

      // enable form
      this.disabledForm = false;

      // handle error
      if (!registerUser.success) {
        const data = registerUser.data;
        let message = data.message;
        if (typeof data.error !== "undefined" && Array.isArray(data.error)) {
          message = "";
          for (let index = 0; index < data.error.length; index++) {
            const err = data.error[index];
            message += `${err.param} ${err.msg}, `;
          }
          message = message.substring(0, message.length - 2);
        }

        this.forms.errorMsg = message;
        this.forms.error = true;
        return;
      }

      // confirmation code notifications
      const resData = registerUser.data;
      this.forms.notifications = resData.notifications;

      // show confirmation code form
      this.forms.isRegister = false;
      this.forms.errorMsg = "";
      this.forms.error = false;
    },
    async confirmRegistration() {
      // disable form
      this.disabledForm = true;
      this.forms.error = false;
      this.forms.errorMsg = "";

      // register user
      const registerUser = await this.$store.dispatch(
        "users/confirmRegistration",
        {
          input: {
            email: this.forms.register.email,
            code: this.forms.confirmation.code,
          },
        }
      );

      // handle error
      if (!registerUser.success) {
        // enable form
        this.disabledForm = false;

        const data = registerUser.data;
        let message = data.message;
        if (typeof data.error !== "undefined") {
          message = "";
          for (let index = 0; index < data.error.length; index++) {
            const err = data.error[index];
            message += `${err.param} ${err.msg}, `;
          }
          message = message.substring(0, message.length - 2);
        }

        this.forms.errorMsg = message;
        this.forms.error = true;
        return;
      }

      // login user
      const loginUser = await this.$store.dispatch("users/login", {
        input: {
          email: this.forms.register.email,
          password: this.forms.register.password,
        },
      });

      // handle login error
      if (!loginUser.success) {
        console.log("login error");
        return;
      }

      // enable form
      this.disabledForm = false;

      // go to dashboard
      this.$router.push({
        path: "/",
      });
    },
    selectCountryCode({ name, iso2, dialCode }) {
      this.forms.register.countryCode = iso2;
    },
    isNumber: function (evt) {
      return form.isNumber(evt);
    },
  },
  mounted() {
    if (this.$route.query.e) {
      const email = Convert.hexToString(this.$route.query.e);
      if (email) {
        this.forms.register.email = email;
      }
    }
  },
};
</script>