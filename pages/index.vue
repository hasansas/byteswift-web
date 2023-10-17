<template>
  <section>
    <v-container class="main-container">
      <v-card flat class="mx-auto text-center mt-16 mb-16 pb-8">
        <h2 class="display-1">Qontak Integration</h2>
        <h4 class="title mt-4">
          Choose your application to integrate to Qontak
        </h4>
      </v-card>
      <v-row justify="center">
        <v-col md="6" v-for="(item, index) in apps" :key="index">
          <v-card flat outlined rounded="xl" class="fill-height py-4 px-8">
            <v-sheet class="d-flex align-top">
              <img
                height="64"
                :src="require(`~/assets/img/logo/${item.image}`)"
                class="mt-6"
              />
              <v-card flat class="ml-4">
                <v-card-title> {{ item.title }} </v-card-title>
                <v-card-subtitle class="body-1 pt-2">
                  {{ item.description }}
                </v-card-subtitle>
                <v-card-actions class="px-4">
                  <v-btn
                    depressed
                    rounded
                    outlined
                    color="primary"
                    :to="item.url"
                    class="px-4"
                  >
                    {{ item.btnLabel }}
                    <v-icon size="20" class="ml-2">
                      {{ item.btnIcon }}
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-sheet>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "IndexPage",
  layout: "dashboard",
  computed: {
    ...mapGetters({
      xeroAuth: "xero/auth",
    }),
  },
  data() {
    return {
      apps: [
        {
          title: "XERO - INVOICES",
          description:
            "Get your invoices and send Whatsapp message trough Qontak",
          image: "xero.png",
          btnLabel: "Send Message",
          btnIcon: "ri-whatsapp-line",
          url: "/xero",
        },
        {
          title: "ZAPIER",
          description:
            "Send Whatsapp message trough Qontak when event is triggered",
          image: "zapier.png",
          btnLabel: "Configure Now",
          btnIcon: "ri-settings-line",
          url: "/zapier",
        },
      ],
    };
  },
  methods: {},
  mounted() {},
};
</script>