<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "XeroCallback",
  layout: "none",
  computed: {
    ...mapGetters({
      xeroAuth: "xero/auth",
    }),
  },
  methods: {
    async getXeroToken() {
      const code = this.$route.query.code;

      const _getXeroToken = await this.$store.dispatch("xero/getToken", {
        code: code,
      });

      // handle error
      if (!_getXeroToken.success) {
        // TODO: do something
      }

      this.$router.push({
        path: "/",
      });
    },
  },
  mounted() {
    this.getXeroToken();
  },
};
</script>
