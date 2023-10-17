<template>
  <section>
    <v-container class="main-container">
      <v-card flat width="800" class="mx-auto">
        <v-card flat class="d-flex align-center mb-8">
          <v-icon size="32">ri-settings-line</v-icon>
          <h2 class="headline ml-4">SETTINGS</h2>
        </v-card>
        <v-card flat outlined rounded="lg" class="mb-6 pa-2">
          <v-card-title class="px-6"> Qontak Settings </v-card-title>
          <v-list two-line>
            <!-- client id -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon> ri-shield-keyhole-line </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Personal Token </v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="configurations.qontak.token !== ''">
                    {{ configurations.qontak.token }}
                  </span>
                  <span v-else class="grey--text"> Not set </span>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="editQontak('token')">
                  <v-icon color="grey">ri-pencil-line</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider inset></v-divider>

            <!-- sekret key -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon> ri-whatsapp-line </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Whatsapp Channel ID</v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="configurations.qontak.whatsappChannelId !== ''">
                    {{ configurations.qontak.whatsappChannelId }}
                  </span>
                  <span v-else class="grey--text"> Not set </span>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="editQontak('channel')">
                  <v-icon color="grey">ri-pencil-line</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-card>
    </v-container>

    <!-- updtae qontak credential -->
    <v-dialog eager persistent v-model="forms.qontak.dialog" width="500">
      <v-card>
        <v-toolbar flat outlined>
          <v-icon>
            {{
              forms.qontak.edited === "token"
                ? "ri-shield-keyhole-line"
                : forms.qontak.edited === "channel"
                ? "ri-whatsapp-line"
                : ""
            }}
          </v-icon>
          <v-toolbar-title class="ml-4">
            {{
              forms.qontak.edited === "token"
                ? "Qontak Personal Token"
                : forms.qontak.edited === "channel"
                ? "Qontak Whatsapp Channel ID"
                : ""
            }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="py-0 mt-8">
          <v-text-field
            v-if="forms.qontak.edited === 'token'"
            v-model="forms.qontak.input.token"
            outlined
            :disabled="forms.qontak.disabled"
          ></v-text-field>
          <v-text-field
            v-if="forms.qontak.edited === 'channel'"
            v-model="forms.qontak.input.whatsappChannelId"
            outlined
            :disabled="forms.qontak.disabled"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="py-4">
          <div class="ml-auto px-2">
            <v-btn
              depressed
              large
              class="mr-2"
              :disabled="forms.qontak.disabled"
              @click="forms.qontak.dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              depressed
              large
              color="primary"
              :disabled="
                (forms.qontak.edited === 'token' &&
                  forms.qontak.input.token === '') ||
                (forms.qontak.edited === 'channel' &&
                  forms.qontak.input.whatsappChannelId === '') ||
                forms.qontak.disabled
              "
              :loading="forms.qontak.disabled"
              @click="updateQontakConfiguratoin"
            >
              Save
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      forms: {
        qontak: {
          dialog: false,
          input: {
            token: "",
            whatsappChannelId: "",
          },
          disabled: false,
          edited: "",
        },
      },
      configurations: {
        rows: [],
        isLoaded: false,
        isDisabled: false,
        qontak: {
          token: "",
          whatsappChannelId: "",
        },
      },
    };
  },
  methods: {
    editQontak(key) {
      this.forms.qontak.input.token = "";
      this.forms.qontak.input.whatsappChannelId = "";
      this.forms.qontak.edited = key;
      this.forms.qontak.dialog = true;
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
      this.configurations.qontak.token = clientConfig.qontak_token;
      this.configurations.qontak.whatsappChannelId =
        clientConfig.qontak_whatsapp_channel_id;
    },
    async updateQontakConfiguratoin() {
      // disable form
      this.forms.qontak.disabled = true;

      //  request body
      const _request = {
        qontak_token: this.forms.qontak.input.token,
        qontak_whatsapp_channel_id: this.forms.qontak.input.whatsappChannelId,
      };

      // this.configurations.qontak.token =
      //   _request.qontak_token || this.configurations.qontak.token;
      // this.configurations.qontak.whatsappChannelId =
      //   _request.qontak_whatsapp_channel_id ||
      //   this.configurations.qontak.whatsappChannelId;

      // update configuration
      const updateConfig = await this.$store.dispatch(
        "client/updateConfiguration",
        { body: _request }
      );

      // get new configuration
      await this.getConfigurations();

      // enable form
      this.forms.qontak.disabled = false;

      if (!updateConfig.success) {
        // TODO: handle error
      }

      this.forms.qontak.dialog = false;
    },
  },
  mounted() {
    // get get configurations
    this.getConfigurations();
  },
};
</script>