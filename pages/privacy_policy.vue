<template>
  <div class="main-container">
    <!-- breadcrumb -->
    <v-breadcrumbs dark large :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-card flat class="pa-6">
      <v-card flat outlined rounded="lg" class="mb-6 pa-2">
        <v-card-title> Privasi dan Kebijakan </v-card-title>

        <v-card-text>
          Sistem aplikasi ByteSift.com ini tidak berafiliasi dengan WhatsApp.
          WhatsApp adalah merk yang terdaftar oleh WhatsApp Inc. Software
          Warranty yang mengikat pada sistem aplikasi ini terbatas pada modul
          untuk pengolahan data yang diterima dan dikirim melalui aplikasi
          ByteSift.com. Kebijakan yang telah dan atau akan diterbitkan oleh
          WhatsApp Inc selaku pemegang merk dagang WhatsApp yang mana dapat
          menyebabkan sistem ini tidak dapat bekerja bukanlah bagian dari
          layanan garansi ini. Kebijakan yang dimaksud dapat berhubungan dengan
          akses penggunaan aplikasi WhatsApp, fitur aplikasi WhatsApp,
          spesifikasi perangkat pendukung, dan kebijakan lainnya yang merupakan
          hak sepenuhnya dari WhatsApp Inc selaku pemilik merk dagang.
        </v-card-text>
      </v-card>

      <v-card flat outlined rounded="lg" class="pa-2">
        <v-card-title> Privacy and Policy </v-card-title>
        <v-card-text>
          This ByteSift.com application system is not affiliated with WhatsApp.
          WhatsApp is a brand registered by WhatsApp Inc. Warranty software that
          binds to this application system is limited to modules for processing
          data received and sent via the ByteSift.com application. Policies that
          have been or will be published by WhatsApp Inc. as WhatsApp trademark
          holders which can cause this system to not work are not part of this
          warranty service. The policy in question can be related to access to
          the use of the WhatsApp application, the features of the WhatsApp
          application, supporting device specifications, and other policies
          which are the full rights of WhatsApp Inc. as the trademark owner.
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      pageTitle: "Privacy and Policy",
      breadcrumbs: [
        {
          text: "Dashboard",
          disabled: false,
          href: "/",
        },
        {
          text: "Privacy and Policy",
          disabled: true,
          href: "/privacy_policy",
        },
      ],
    };
  },
  mounted() {
    // page title
    this.$nuxt.$emit("pageTitle", this.pageTitle);
  },
};
</script>
