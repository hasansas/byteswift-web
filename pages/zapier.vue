<template>
  <section>
    <v-container class="main-container">
      <!-- <v-card flat class="d-flex align-center mb-8">
        <img height="32" src="~/assets/img/logo/zapier.png" />
        <h2 class="headline ml-4">ZAPIER</h2>
      </v-card> -->
      <!-- <v-list>
        <v-card flat outlined>
          <v-list-item>
            <v-list-item-icon>
              <img height="32" src="~/assets/img/logo/zoho-crm.png" />
            </v-list-item-icon>
            <v-list-item-title> ZOHO - New Lead Created </v-list-item-title>
            <v-list-item-action>
              <v-icon>ri-more-2-line</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-list> -->

      <v-card flat width="800" class="mx-auto">
        <v-card flat class="d-flex align-center mb-8">
          <img height="32" src="~/assets/img/logo/zapier.png" />
          <h2 class="headline ml-4">ZAPIER</h2>
        </v-card>
        <v-card flat outlined rounded="lg" class="mb-6 pa-2">
          <v-list-item>
            <v-list-item-icon>
              <img height="32" src="~/assets/img/logo/zoho-crm.png" />
            </v-list-item-icon>
            <v-list-item-title> ZOHO - New Lead Created </v-list-item-title>
            <v-list-item-action> </v-list-item-action>
          </v-list-item>
          <v-list two-line class="ml-14">
            <!-- Template -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon> ri-article-line </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> Whatsapp Template </v-list-item-title>
                <v-list-item-subtitle v-if="whatsappTemplate.isLoaded">
                  <span v-if="whatsappTemplate.selected !== null">
                    {{ whatsappTemplate.selected.name }}
                  </span>
                  <span v-else class="grey--text"> Not set </span>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="editWhatsappTemplate">
                  <v-icon color="grey">ri-pencil-line</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider inset></v-divider>

            <!-- basic token -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon> ri-shield-keyhole-line </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Basic Token</v-list-item-title>
                <v-list-item-subtitle style="white-space: inherit">
                  {{ configurations.basicKey }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey">ri-file-copy-line</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider inset></v-divider>

            <!-- api key -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon> ri-key-line </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>API Key</v-list-item-title>
                <v-list-item-subtitle style="white-space: inherit">
                  {{ configurations.apiKey }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey">ri-file-copy-line</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-card>
    </v-container>

    <!-- updtae whatsapp template -->
    <v-dialog eager v-model="forms.dialog" width="400">
      <v-card>
        <v-toolbar flat outlined>
          <v-icon>ri-article-line</v-icon>
          <v-toolbar-title class="ml-4"> Whatsapp Template </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="py-0 mt-8">
          <!-- select template -->
          <v-select
            v-model="configurations.qontak.zohoLeadCreatedTemplateId"
            label="Select template"
            :items="whatsappTemplate.rows"
            item-text="name"
            item-value="id"
            single-line
            outlined
            dense
            hide-details
            append-icon="ri-arrow-drop-down-line"
            :loading="!whatsappTemplate.isLoaded"
            @change="selectTemplate"
            ref="inputSelectTemplate"
            class="mb-4"
          >
            <template v-slot:prepend-inner>
              <v-icon size="16" class="mt-1 mr-2"> ri-layout-2-line </v-icon>
            </template>
          </v-select>

          <!-- Preview message -->
          <v-card flat color="#f3ede7" class="chat-screen">
            <v-app-bar color="green" dark>
              <v-list-item class="pa-0">
                <v-list-item-avatar color="white">
                  <v-icon color="green"> ri-whatsapp-fill </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Byteswift</v-list-item-title>
                  <v-list-item-subtitle>+62 801-5432-9876</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-card
              flat
              color="transparent"
              class="messages-container overflow-y-auto"
              height="500"
            >
              <v-list color="transparent">
                <v-list-item v-if="whatsappTemplate.selected !== null">
                  <div class="message received">
                    <div
                      v-if="whatsappTemplate.selected.body != ''"
                      class="text"
                      v-html="whatsappTemplate.selected.body"
                    ></div>
                  </div>
                </v-list-item>
              </v-list>
            </v-card>
          </v-card>
        </v-card-text>
        <v-card-actions class="mt-2 py-4">
          <div class="ml-auto px-2">
            <v-btn
              depressed
              large
              color="primary"
              :disabled="whatsappTemplate.selected === null"
              :loading="forms.disabled"
              @click="updateQontakConfiguratoin"
            >
              Use this template
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import crypto from "crypto";
import { mapGetters } from "vuex";

export default {
  name: "ZapierPage",
  layout: "dashboard",
  computed: {
    ...mapGetters({
      xeroAuth: "xero/auth",
    }),
  },
  data() {
    return {
      forms: {
        dialog: false,
        disabled: false,
      },
      configurations: {
        rows: [],
        isLoaded: false,
        isDisabled: false,
        qontak: {
          zohoLeadCreatedTemplateId: "",
        },
        apiKey: process.env.API_KEY,
        basicKey: "",
      },
      whatsappTemplate: {
        rows: [],
        selected: null,
        isLoaded: false,
      },
    };
  },
  methods: {
    selectTemplate(id) {
      this.$refs.inputSelectTemplate.blur();
      const templates = this.whatsappTemplate.rows;
      const selectedTemplate = templates.find((e) => e.id === id);

      this.whatsappTemplate.selected = selectedTemplate || null;
    },
    editWhatsappTemplate() {
      this.forms.dialog = true;
    },
    async getConfigurations() {
      this.configurations.isDisabled = true;
      const getClientConfig = await this.$store.dispatch(
        "client/getConfiguration"
      );
      this.configurations.isLoaded = true;
      this.configurations.isDisabled = false;
      if (!getClientConfig.success) {
        // TODO: handle error
        return;
      }

      // get configuration
      this.configurations.rows = getClientConfig.data;

      // convert configuration array to object
      const clientConfig = this.configurations.rows.reduce((current, next) => {
        const item = {};
        item[next.name] = next.value;
        return { ...current, ...item };
      }, {});

      // set input configuration
      this.configurations.qontak.zohoLeadCreatedTemplateId =
        clientConfig.qontak_zoho_lead_created_template_id;
    },
    async updateQontakConfiguratoin() {
      // disable form
      this.forms.disabled = true;

      //  request body
      const _request = {
        qontak_zoho_lead_created_template_id:
          this.configurations.qontak.zohoLeadCreatedTemplateId,
      };

      // update configuration
      const updateConfig = await this.$store.dispatch(
        "client/updateConfiguration",
        { body: _request }
      );

      // get new configuration
      await this.getConfigurations();

      if (!updateConfig.success) {
        // TODO: handle error
      }

      // enable form
      this.forms.disabled = false;

      this.forms.dialog = false;
    },
    async getWhatsappTemplate() {
      this.configurations.isDisabled = true;
      const _getWhatsappTemplate = await this.$store.dispatch(
        "qontak/getWhatsappTemplate"
      );

      if (!_getWhatsappTemplate.success) {
        // TODO: handle error
        return;
      }

      // get configuration
      this.whatsappTemplate.rows = _getWhatsappTemplate.data;
      this.whatsappTemplate.isLoaded = true;

      // set selected template
      this.selectTemplate(this.configurations.qontak.zohoLeadCreatedTemplateId);
    },
    getClientKey() {
      this.$store.dispatch("client/get").then((res) => {
        const clientKey = res.data.data.clientKey;
        const serverKey = res.data.data.serverKey;

        const key = clientKey + ":" + serverKey;
        const basicKey = Buffer.from(key).toString("base64");

        this.configurations.basicKey = basicKey;
      });
    },
  },
  mounted() {
    // get get configurations
    this.getConfigurations();

    // get whatsapp templates
    this.getWhatsappTemplate();

    // get clientKey
    this.getClientKey();
  },
};
</script>