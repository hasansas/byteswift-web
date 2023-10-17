<template>
  <div class="fill-height login">
    <div class="header">
      <div class="header-bottom">
        <div class="separator">
          <svg
            x="0"
            y="0"
            viewBox="0 0 2560 100"
            preserveAspectRatio="none"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              class="fill-default"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </div>
    </div>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col>
          <div class="content-header d-flex justify-center align-center">
            <v-icon size="40" color="white">ri-rocket-line</v-icon>
            <h3>VemoBlast</h3>
          </div>
          <v-card
            width="440"
            class="mx-auto"
            rounded="lg"
            flat
            :loading="!dataLoaded"
          >
            <template slot="progress">
              <v-progress-linear
                color="primary"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-container>
              <div class="login-content">
                <div class="title text-center mb-12">Reset Password</div>
                <div class="text-center">
                  <v-avatar
                    v-if="dataLoaded"
                    :color="success ? 'green lighten-5' : 'red lighten-5'"
                    size="128"
                  >
                    <v-icon
                      :color="success ? 'green lighten-3' : 'red lighten-3'"
                      size="40"
                    >
                      {{ success ? "ri-check-line" : "ri-alert-line" }}</v-icon
                    >
                  </v-avatar>
                  <v-avatar v-else color="purple lighten-5" size="128">
                    <v-icon color="purple lighten-3" size="40">
                      ri-refresh-line
                    </v-icon>
                  </v-avatar>
                  <p class="mt-8">
                    {{
                      !dataLoaded
                        ? "Resetting your password..."
                        : success
                        ? "Your reset password request has been sent. An email has been sent to your email address that your VemoBlast account registered with."
                        : message
                    }}
                  </p>
                </div>
              </div>
            </v-container>
          </v-card>

          <div class="text-center white--text my-6">
            <span class="text--opacity">Back to</span>
            <NuxtLink to="/login" class="white--text"> Login </NuxtLink>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: "single",
  head: {
    title: "Reset password",
  },
  data() {
    return {
      message: "",
      success: false,
      dataLoaded: false,
    };
  },
  methods: {
    async resetPassword() {
      const code = this.$route.params.code;

      // reset password
      const _forgotPassword = await this.$store.dispatch(
        "users/resetPassword",
        { code }
      );
      this.dataLoaded = true;

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

        this.message = message;
        return;
      }

      // success
      this.success = true;
    },
  },
  mounted() {
    this.message = "";
    this.success = false;
    this.dataLoaded = false;

    this.resetPassword();
  },
};
</script>

<style lang="sass" scoped>
// $background-color: #172B4D
$background-color: #5800a0

.login
  background: $background-color
.header
  position: absolute
  height: 50%
  top: 0
  left: 0
  right: 0
    // background: linear-gradient(87deg,#29ED93,#1AD0B5) !important
  .header-bottom
    position: relative
    height: 100%
    .separator
      position: absolute
      bottom: 0
      width: 100%
      height: 64px
      overflow: hidden
      &::before
        content: ""
        border-style: solid
        border-width: 0 0 64px 1920px
        border-color: transparent transparent $background-color transparent
        box-sizing: border-box
        position: absolute
        top: 0
        left: 0
        right: 0

        svg
          position: absolute
          bottom: 0
          left: 0
          right: 0
          fill: $background-color
.container
  padding: 16px
  .content-header
    position: relative
    text-align: center
    color: #fff
    margin-bottom: 64px

.heading-title
  text-align: center
  margin: 16px 0 64px

.login-content
  padding: 16px
  .btn-forgot-password
    text-align: right
    font-weight: 500
    .inverse
      color: inherit

    .btn-group
      text-align: center
    .btn-submit
      margin: 32px 0 24px

.login-bottom
  text-align: center
  margin-top: 16px

.text--opacity
  opacity: 0.7
</style>