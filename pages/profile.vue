<template>
  <div class="main-container mx-auto">
    <!-- breadcrumb -->
    <!-- <v-breadcrumbs dark large :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs> -->

    <v-card flat rounded="lg" class="pa-6 mb-8">
      <v-card flat>
        <v-toolbar dark flat :src="mountain" height="240"> </v-toolbar>
        <v-avatar
          width="128"
          height="128"
          color="white"
          class="mx-6"
          style="margin-top: -80px"
        >
          <v-avatar width="120" height="120" dark color="#99C9DD">
            <v-img
              v-if="user.image.url !== null"
              :aspect-ratio="1 / 1"
              :src="user.image.url"
            ></v-img>
            <v-icon v-else size="32" color="white"> ri-user-3-line </v-icon>
          </v-avatar>
        </v-avatar>

        <v-card-actions>
          <v-card-title class="px-6 headline text-capitalize">
            {{ user.name }}
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            dark
            color="blue"
            class="px-4"
            @click="forms.user.dialog = true"
          >
            <v-icon size="20" class="mr-4">ri-pencil-line</v-icon>
            Edit
          </v-btn>
          <v-btn depressed dark color="red" class="px-4" @click="logout">
            <v-icon size="20" class="mr-4">ri-logout-circle-line</v-icon>
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>

    <v-card flat rounded="lg" class="pa-6">
      <v-card flat outlined rounded="lg" class="mb-6 pa-2">
        <v-card-title class="px-6"> Account </v-card-title>
        <v-list two-line>
          <!-- email -->
          <v-list-item>
            <v-list-item-icon>
              <v-icon> ri-at-line </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ user.email }}</v-list-item-title>
              <v-list-item-subtitle>Email</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>

          <!-- phone -->
          <v-list-item>
            <v-list-item-icon>
              <v-icon> ri-phone-line </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>(650) 555-1234</v-list-item-title>
              <v-list-item-subtitle>Mobile</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey">ri-pencil-line</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider inset></v-divider>

          <!-- whatsapp -->
          <v-list-item>
            <v-list-item-icon>
              <v-icon> ri-whatsapp-line </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="grey--text text--lighten-1">
                Not set
              </v-list-item-title>
              <v-list-item-subtitle>Whatsapp</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey">ri-pencil-line</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card flat outlined rounded="lg" class="pa-2">
        <v-card-title class="px-6"> Security </v-card-title>
        <v-list two-line>
          <v-list-item>
            <v-list-item-icon>
              <v-icon> ri-lock-password-line </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> Password </v-list-item-title>
              <v-list-item-subtitle>
                <span>Change my password</span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="openChangePasswordForm">
                <v-icon color="grey">ri-pencil-line</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card>

    <!-- Edit user -->
    <v-dialog v-model="forms.user.dialog" eager persistent width="400">
      <v-card flat class="pa-4">
        <v-card flat>
          <v-toolbar dark flat :src="mountain" height="200"> </v-toolbar>
          <v-card
            flat
            color="transparent"
            class="mx-auto text-center"
            style="margin-top: -100px"
          >
            <div class="avatar">
              <v-avatar width="168" height="168" color="white">
                <v-avatar
                  width="160"
                  height="160"
                  dark
                  color="#99C9DD"
                  class="white--text"
                >
                  <v-img
                    v-if="
                      forms.avatar.uploading && forms.avatar.preview !== null
                    "
                    :aspect-ratio="1 / 1"
                    :src="forms.avatar.preview"
                    class="blur"
                  ></v-img>
                  <template v-else>
                    <v-img
                      v-if="user.image.url !== null"
                      :aspect-ratio="1 / 1"
                      :src="user.image.url"
                    ></v-img>
                    <v-icon v-else size="40" color="white">
                      ri-user-3-line
                    </v-icon>
                  </template>
                </v-avatar>
              </v-avatar>

              <v-progress-circular
                v-if="forms.avatar.uploading"
                class="uplaod-progress"
                color="#289bc5"
                :size="160"
                indeterminate
              >
              </v-progress-circular>
              <form v-else enctype="multipart/form-data">
                <v-btn depressed fab dark class="btn-upload" color="secondary">
                  <v-icon style="color: white"> ri-pencil-line </v-icon>
                  <input
                    type="file"
                    accept="image/*"
                    @change="updateUserImage"
                  />
                </v-btn>
              </form>
            </div>
          </v-card>
          <v-card-text class="mt-8 px-2">
            <v-form>
              <v-text-field
                v-model="forms.user.input.name"
                label="Full Name"
                prepend-inner-icon="ri-user-3-line"
                outlined
                hide-details
                class="mb-4"
                :disabled="forms.user.disabled"
              ></v-text-field>
              <v-text-field
                v-model="forms.user.input.phoneNumber"
                label="Phone number"
                prepend-inner-icon="ri-phone-line"
                outlined
                hide-details
                class="mb-4"
                :disabled="forms.user.disabled"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              depressed
              :disabled="forms.user.disabled"
              @click="forms.user.dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              depressed
              color="primary"
              class="px-4"
              :disabled="
                forms.user.input.name === null || forms.user.input.name === ''
              "
              :loading="forms.user.disabled"
              @click="updateProfile"
            >
              Save
              <v-icon size="20" class="ml-2">ri-check-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>

    <!-- Change password -->
    <v-dialog
      v-model="forms.changePassword.dialog"
      eager
      persistent
      width="400"
    >
      <v-card flat class="pa-4">
        <v-card flat>
          <v-toolbar dark flat color="#5800a0" height="200"> </v-toolbar>
          <v-card
            flat
            color="transparent"
            class="mx-auto text-center"
            style="margin-top: -100px"
          >
            <div class="avatar">
              <v-avatar width="168" height="168" color="white">
                <v-avatar width="160" height="160" dark color="#ebe0f4">
                  <v-icon size="40" color="#5800a0">
                    ri-lock-password-line
                  </v-icon>
                </v-avatar>
              </v-avatar>
            </div>
          </v-card>
          <v-form
            @submit.stop.prevent="changePassword"
            ref="changePasswordForm"
          >
            <v-card-text class="mt-8 px-2">
              <!-- error message -->
              <v-alert
                v-if="forms.changePassword.status === 'error'"
                text
                icon="ri-notification-3-line"
                type="error"
                class="mb-8"
              >
                {{ forms.changePassword.result.message }}
              </v-alert>
              <v-alert
                v-else-if="forms.changePassword.status === 'success'"
                text
                icon="ri-notification-3-line"
                type="success"
                class="mb-8"
              >
                Password successfully changed
              </v-alert>
              {{ forms.changePassword.status }}
              <v-text-field
                v-model="forms.changePassword.input.oldPassword"
                label="Old password"
                type="password"
                outlined
                hide-details
                class="mb-4"
                :disabled="forms.changePassword.disabled"
                ><template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-shield-keyhole-line</v-icon>
                </template>
              </v-text-field>
              <v-text-field
                v-model="forms.changePassword.input.newPassword"
                label="New password"
                type="password"
                outlined
                hide-details
                class="mb-4"
                :disabled="forms.changePassword.disabled"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-lock-password-line</v-icon>
                </template>
              </v-text-field>
              <v-text-field
                v-model="forms.changePassword.input.confirmNewPassword"
                label="Retype new password"
                type="password"
                outlined
                hide-details
                class="mb-4"
                :disabled="forms.changePassword.disabled"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-4">ri-lock-2-line</v-icon>
                </template>
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                depressed
                :disabled="forms.changePassword.disabled"
                @click="forms.changePassword.dialog = false"
              >
                Close
              </v-btn>
              <v-btn
                type="submit"
                depressed
                color="primary"
                class="px-4"
                :disabled="
                  forms.changePassword.input.oldPassword === null ||
                  forms.changePassword.input.newPassword === '' ||
                  forms.changePassword.input.confirmNewPassword === ''
                "
                :loading="forms.changePassword.disabled"
              >
                Change password
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import mountain from "~/assets/img/mountain.jpg";

export default {
  layout: "dashboard",
  head() {
    return {
      title: "Profile",
    };
  },
  data() {
    return {
      mountain,
      pageTitle: "Profile",
      breadcrumbs: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/",
        },
        {
          text: "Profile",
          disabled: true,
          to: "/profile",
        },
      ],
      forms: {
        user: {
          dialog: false,
          input: {
            name: "",
            phoneNumber: "",
            waNumber: "",
          },
          disabled: false,
        },
        avatar: {
          uploading: false,
          preview: null,
        },
        changePassword: {
          dialog: false,
          input: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          },
          rules: {
            password: [(v) => !!v || "Password is required"],
            confirmPasswordRules: [
              (v) => !!v || "This field is required",
              (v) =>
                v == this.forms.changePassword.input.newPassword ||
                "Password does not match",
            ],
          },
          disabled: false,
          result: {
            status: "",
            message: "",
          },
        },
      },
      snackbar: {
        show: false,
        text: "",
        color: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "users/user",
    }),
  },
  methods: {
    async logout() {
      // logout user
      await this.$store.dispatch("users/logout");

      // redirect to login page
      this.$router.push({
        path: "/login",
      });
    },
    updateUserImage: async function (event) {
      const vm = this;
      const input = event.target;

      this.forms.avatar.uploading = true;

      // upload image
      const fileImage = input.files[0];
      if (fileImage !== null) {
        // get image preview
        var reader = new FileReader();
        reader.readAsDataURL(fileImage);
        reader.onload = function () {
          vm.forms.avatar.preview = reader.result;
        };
        reader.onerror = function (error) {
          // console.log("Error: ", error);
          vm.forms.avatar.preview = null;
        };

        // upload image
        const formDataImage = new FormData();
        formDataImage.append("file", fileImage);
        formDataImage.append("type", "image");

        const uploadImage = await this.$store.dispatch("upload/post", {
          file: formDataImage,
        });

        if (!uploadImage.success) {
          this.forms.avatar.uploading = false;
          return (vm.snackbar = {
            show: true,
            text: "Unable to upload image",
            color: "red",
          });
        }
        const resData = uploadImage.data.data;
        const image = {
          name: resData.name,
          fileName: resData.fileName,
          url: resData.url,
        };

        const updateUser = await vm.$store.dispatch("users/update", {
          body: { image },
        });
        this.forms.avatar.uploading = false;

        // handle update error
        // console.log(updateUser);
      }
    },
    async updateProfile() {
      this.forms.user.disabled = true;
      const updateUser = await this.$store.dispatch("users/update", {
        body: this.forms.user.input,
      });
      this.forms.user.disabled = false;

      // handle update error
      // console.log(updateUser);
      this.forms.user.dialog = false;
    },
    openChangePasswordForm() {
      this.resetChnagePasswordForm();
      this.forms.changePassword.dialog = true;
    },
    async changePassword() {
      if (!this.$refs.changePasswordForm.validate()) return;

      this.forms.changePassword.disabled = true;

      const updateUser = await this.$store.dispatch("users/changePassword", {
        input: this.forms.changePassword.input,
      });

      this.forms.changePassword.disabled = false;

      // handle error
      if (!updateUser.success) {
        const data = updateUser.data;
        let message = data.message;

        if (typeof data.error !== "undefined" && Array.isArray(data.error)) {
          message = "";
          for (let index = 0; index < data.error.length; index++) {
            const err = data.error[index];
            message += `${err.param} ${err.msg}, `;
          }
          message = message.substring(0, message.length - 2);
        }

        this.forms.changePassword.status = "error";
        this.forms.changePassword.result.message = message;
        return;
      }

      this.resetChnagePasswordForm();
      this.forms.changePassword.status = "success";
    },
    resetChnagePasswordForm() {
      this.forms.changePassword.input.oldPassword = "";
      this.forms.changePassword.input.newPassword = "";
      this.forms.changePassword.input.confirmNewPassword = "";
      this.forms.changePassword.status = "";
      this.forms.changePassword.result.message = "";
      this.$refs.changePasswordForm.reset();
      this.$refs.changePasswordForm.resetValidation();
    },
  },
  mounted() {
    // page title
    this.$nuxt.$emit("pageTitle", this.pageTitle);

    // set user form
    this.forms.user.input.name = this.user.name;
    this.forms.user.input.phoneNumber = this.user.phoneNumber;
  },
};
</script>


<style lang="sass" scoped>
.avatar
  position: relative
  display: inline-block
  overflow: hidden
  .blur
    opacity: 0.3
  .uplaod-progress
    position: absolute
    top: 4px
    left: 4px

  .btn-upload
    position: absolute
    top: 0
    right: 0
    overflow: hidden

    @media screen and (min-width: 992px)
      top: 4px
      right: 0

  input[type="file"]
    font-size: 72px
    opacity: 0
    height: 1000px
    width: 1000px
    position: absolute
    top: 0
    left: 0
    cursor: pointer
    z-index: 100
</style>
