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
                <v-list-item-subtitle>uuuuu</v-list-item-subtitle>
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
                <v-list-item-subtitle>nnk</v-list-item-subtitle>
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
          <v-icon> ri-whatsapp-line </v-icon>
          <v-toolbar-title class="ml-4"> Whatsapp Channel ID </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="py-0 mt-8">
          <v-text-field
            v-model="forms.qontak.input.name"
            outlined
            :disabled="forms.qontak.disabled"
          ></v-text-field>
          <!-- <v-text-field
            v-model="forms.qontak.input.whatsappChannelId"
            outlined
            :disabled="forms.qontak.whatsappChannelId"
          ></v-text-field> -->
        </v-card-text>
        <v-card-actions class="py-4">
          <div class="ml-auto px-2">
            <v-btn
              depressed
              class="mr-2"
              :disabled="forms.qontak.disabled"
              @click="forms.qontak.dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              depressed
              color="primary"
              :disabled="
                forms.qontak.input.token === '' || forms.qontak.disabled
              "
              :loading="forms.qontak.disabled"
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
          dialog: true,
          input: {
            token: "",
            whatsappChannelId: "",
          },
          disabled: false,
          edited: "",
        },
      },
    };
  },
  methods: {
    editQontak(key) {
      console.log(key);
    },
  },
  mounted() {},
};
</script>