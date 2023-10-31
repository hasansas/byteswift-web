<template>
  <section>
    <v-container class="main-container">
      <v-card flat class="d-flex align-center mb-8">
        <img height="32" src="~/assets/img/logo/xero.png" />
        <h2 class="headline ml-4">XERO - Invoices</h2>
        <v-spacer></v-spacer>
        <v-btn depressed outlined @click="forms.settings.dialog = true">
          Template
          <v-icon class="ml-4"> ri-settings-line </v-icon>
        </v-btn>
      </v-card>
      <v-card
        v-if="xeroAuth.access_token === ''"
        flat
        class="full-height d-flex justify-center align-center"
      >
        <v-card flat class="text-center">
          <v-card-title class="display-1 mt-4 mb-8">
            Xero Not Connected
          </v-card-title>
          <v-btn depressed outlined large @click="loginXero">
            <span class="ml-2">Connect Now</span>
          </v-btn>
        </v-card>
      </v-card>
      <template v-else>
        <v-card flat class="rounded-lg mb-4">
          <v-toolbar flat outlined>
            <!-- organization -->
            <v-sheet width="256">
              <v-select
                v-model="forms.organization.value"
                label="Select organization"
                :items="organization.data"
                item-text="tenantName"
                item-value="tenantId"
                single-line
                outlined
                dense
                hide-details
                append-icon="ri-arrow-drop-down-line"
                :disabled="forms.organization.disabled"
                :loading="forms.organization.isLoading"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="18" class="mt-1 mr-2">
                    ri-layout-2-line
                  </v-icon>
                </template>
              </v-select>
            </v-sheet>

            <!-- due date -->
            <v-sheet width="256" class="ml-4">
              <v-menu
                v-model="forms.inputDate"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="forms.date"
                    label="Due Date"
                    readonly
                    single-line
                    outlined
                    dense
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="18" class="mt-1 mr-2">
                        ri-calendar-line
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="forms.date"
                  @input="forms.inputDate = false"
                ></v-date-picker>
              </v-menu>
            </v-sheet>
            <v-spacer></v-spacer>
            <v-btn
              depressed
              height="40"
              color="primary"
              @click="getInvoices"
              :disabled="forms.organization.value === null"
              :loading="forms.invoices.disabled"
            >
              Get Invoices
            </v-btn>
          </v-toolbar>
        </v-card>

        <!-- data table -->
        <v-card v-if="invoices.isLoaded" flat outlined class="rounded-lg">
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn
              depressed
              outlined
              :disabled="
                dataTable.rows.length === 0 ||
                whatsappTemplate.input.template === null
              "
              @click="sendMessage"
            >
              <v-icon size="20" class="mr-2">ri-whatsapp-line</v-icon>
              Send Message
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-data-table
            :key="dataTable.key"
            :headers="dataTable.headers"
            :items="dataTable.rows"
            :items-per-page="dataTable.pagination.perPage"
            :page.sync="dataTable.pagination.currentPage"
            :loading="dataTable.isLoading"
            item-key="id"
            loading-text="Loading... Please wait"
            hide-default-footer
          >
            <template v-slot:no-data>
              <span v-if="dataTable.isFiltered"> No matches found </span>
              <span v-else> Data is empty </span>
            </template>
            <template v-slot:item.to="{ item }">
              {{ item.Contact.Name }}
            </template>
            <template v-slot:item.Date="{ item }">
              {{
                $moment(dateStringToTimestamp(item.Date)).format("DD MMM YYYY")
              }}
            </template>
            <template v-slot:item.DueDate="{ item }">
              {{
                $moment(dateStringToTimestamp(item.DueDate)).format(
                  "DD MMM YYYY"
                )
              }}
            </template>
          </v-data-table>
          <v-divider></v-divider>
          <template v-if="dataTable.rows.length > 0">
            <v-card-actions class="px-6">
              <span class="subtitle-1 grey--text">
                <div>About {{ dataTable.rows.length }} results</div>
              </span>
              <v-spacer></v-spacer>
              <v-pagination
                v-model="dataTable.pagination.currentPage"
                :length="dataTable.pagination.totalPage"
                :total-visible="10"
              ></v-pagination>
            </v-card-actions>
            <!-- <v-card-actions class="mt-8">
            <v-spacer></v-spacer>
            <v-btn
              depressed
              outlined
              large
              :disabled="forms.organization.value === null"
              :loading="forms.invoices.disabled"
              @click="getInvoices"
            >
              <v-icon class="mr-2">ri-whatsapp-line</v-icon>
              SEND MESSAGE
            </v-btn>
          </v-card-actions> -->
          </template>
        </v-card>
      </template>

      <!-- get contacts -->
      <v-dialog v-model="contacts.dialog" persistent eager width="460">
        <v-card flat height="540" class="overflow-hidden">
          <v-container v-if="contacts.isLoading" class="fill-height">
            <v-row class="text-center">
              <v-col>
                <v-card flat height="220" class="mb-12">
                  <v-container class="fill-height">
                    <v-row class="text-center">
                      <v-col>
                        <v-avatar
                          v-if="createMessage.state === 'error'"
                          width="180"
                          height="180"
                          color="red lighten-5 "
                        >
                          <v-icon size="48" color="red"> ri-alert-line </v-icon>
                        </v-avatar>
                        <img
                          v-else-if="createMessage.state === 'success'"
                          width="200"
                          src="~/assets/img/check-success.jpg"
                        />
                        <div v-else class="sync-loader"></div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
                <div>
                  <span v-if="createMessage.state === 'get_contact'">
                    Getting contact number:
                  </span>
                  <p>{{ createMessage.value }}</p>
                  <p class="px-16 caption red--textss">
                    {{ createMessage.error }}
                  </p>
                </div>
                <v-btn
                  v-if="
                    createMessage.state === 'error' ||
                    createMessage.state === 'success'
                  "
                  depressed
                  color="secondary"
                  @click="contacts.dialog = !contacts.dialog"
                  class="mt-8 px-8"
                >
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-container>

    <!-- updtae whatsapp template -->
    <v-dialog eager v-model="forms.settings.dialog" width="400">
      <v-card>
        <v-toolbar flat outlined>
          <v-icon>ri-article-line</v-icon>
          <v-toolbar-title class="ml-4"> Whatsapp Template </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="py-0 mt-8">
          <!-- select template -->
          <v-select
            v-model="whatsappTemplate.input.template"
            label="Template"
            :items="whatsappTemplate.rows"
            item-text="name"
            item-value="id"
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
              <v-icon size="16" class="mt-1 mr-2"> ri-article-line </v-icon>
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
              height="400"
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
              :disabled="whatsappTemplate.input.template === null"
              :loading="forms.settings.disabled"
              @click="updateQontakConfiguratoin"
            >
              Save Changes
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
  name: "XeroPage",
  layout: "dashboard",
  computed: {
    ...mapGetters({
      xeroAuth: "xero/auth",
    }),
  },
  data() {
    return {
      dataTable: {
        key: 0,
        headers: [
          {
            text: "Number",
            value: "InvoiceNumber",
            align: "start",
            sortable: false,
          },
          {
            text: "Ref",
            value: "Reference",
            align: "start",
            sortable: false,
          },
          {
            text: "To",
            value: "to",
            align: "start",
            sortable: false,
          },
          {
            text: "Date",
            value: "Date",
            align: "start",
            sortable: false,
          },
          {
            text: "Due Date",
            value: "DueDate",
            align: "start",
            sortable: false,
          },
          {
            text: "SubTotal",
            value: "SubTotal",
            align: "start",
            sortable: false,
          },
          {
            text: "TotalTax",
            value: "TotalTax",
            align: "start",
            sortable: false,
          },
          {
            text: "Total",
            value: "Total",
            align: "start",
            sortable: false,
          },
        ],
        rows: [],
        pagination: {
          perPage: 10,
          currentPage: 1,
          totalPage: 0,
        },
        isDataLoaded: false,
        isLoading: false,
        isFiltered: false,
      },
      forms: {
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0, 10),
        inputDate: false,
        organization: {
          value: null,
          disabled: true,
          isLoading: false,
        },
        invoices: {
          disabled: false,
        },
        settings: {
          dialog: false,
          disabled: false,
        },
      },
      organization: {
        data: [],
        isLoaded: false,
      },
      invoices: {
        data: [],
        isLoaded: false,
      },
      contacts: {
        dialog: false,
        isLoading: true,
        isLoaded: false,
      },
      createMessage: {
        state: "get_contact",
        value: "",
        error: "",
      },
      whatsappTemplate: {
        rows: [],
        selected: null,
        isLoaded: false,
        input: {
          template: "",
        },
      },
      configurations: {
        rows: [],
        isLoaded: false,
        isDisabled: false,
      },
    };
  },
  methods: {
    async loginXero() {
      const apiUrl = "https://login.xero.com/identity/connect/authorize";
      const responseType = "code";
      const clientId = process.env.XERO_CLIENT_ID;
      const redirectUri = process.env.XERO_REDIRECT_URI;
      const scope =
        "openid profile email accounting.transactions accounting.contacts offline_access";
      const state = Math.floor(Math.random() * 9000 + 1000);

      const loginUrl = `${apiUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      window.open(loginUrl, "_self");
    },
    async getTenant() {
      this.forms.organization.isLoading = true;
      const _getTenant = await this.$store.dispatch("xero/getTenant");
      this.forms.organization.isLoading = false;

      if (!_getTenant.success) {
        // TODO: handle error
      }
      this.organization.data = _getTenant.data;
      this.organization.isLoaded = true;
      this.forms.organization.disabled = false;
    },
    async getInvoices() {
      const tenantId = this.forms.organization.value;

      this.forms.invoices.disabled = true;
      const _getInvoices = await this.$store.dispatch("xero/getInvoices", {
        tenantId,
        dueDate: this.forms.date,
      });
      this.forms.invoices.disabled = false;

      if (!_getInvoices.success) {
        console.log("Error");
        return;
      }

      this.dataTable.rows = _getInvoices.data;
      this.dataTable.pagination.totalPage = Math.ceil(
        _getInvoices.data.length / this.dataTable.pagination.perPage
      );
      this.invoices.isLoaded = true;
    },
    dateStringToTimestamp(str) {
      return parseInt(str.substring(6, 19));
    },
    async sendMessage() {
      this.contacts.dialog = true;

      // get xero contacts
      const contacts = await this.getContact();

      // qontak createBroadcast
      const contactListName = "Invoice " + this.$moment().format("YYYY-MM-DD");
      await this.createBroadcast({
        name: contactListName,
        contacts: contacts,
      });
    },
    async getContact() {
      this.createMessage.state = "get_contact";
      this.createMessage.value = "";
      this.createMessage.error = "";

      const invoices = this.dataTable.rows;
      const contacts = [];

      for (let index = 0; index < invoices.length; index++) {
        const _item = invoices[index];
        const _contact = _item.Contact;

        this.createMessage.value = _contact.Name;

        // get contact detail
        const _getContact = await this.$store.dispatch("xero/getContact", {
          contcatId: _contact.ContactID,
          tenantId: this.forms.organization.value,
        });

        if (_getContact.success) {
          const _contactData = _getContact.data;

          contacts.push(_contactData);
        }
      }
      return contacts;
    },
    async createBroadcast({ name, contacts }) {
      const vm = this;

      // create broadcast recipient
      this.createMessage.state = "create_contact_list";
      this.createMessage.value = "Creating contacts list";

      const _contacts = [];
      for (let index = 0; index < contacts.length; index++) {
        const _contact = contacts[index];
        const _contactFirstName = _contact?.FirstName || "";
        const _contactLastName = _contact?.LastName || "";
        const _contactName =
          _contactFirstName !== "" && _contactFirstName !== ""
            ? `${_contactFirstName} ${_contactLastName}`
            : "";
        const _item = {
          phone_number: _contact.Phone,
          full_name: _contactName || _contact.Name || "",
          customer_name: _contact.Name !== "" ? _contact.Name : _contactName,
          company: _contact.Name !== "" ? _contact.Name : _contactName,
        };
        _contacts.push(_item);
      }

      const _createRecipient = await this.$store.dispatch(
        "qontak/createBroadcastRecipient",
        {
          name: name,
          contacts: _contacts,
        }
      );

      if (!_createRecipient.success) {
        this.createMessage.state = "error";
        this.createMessage.value = "Unable to create contact list";
        return;
      }

      // sendng broadcast
      this.createMessage.state = "create_broadcasr";
      this.createMessage.value = "Creating Broadcast";

      const broadcastName = "Invoice " + this.$moment().format("YYYY-MM-DD");
      const messageTemplateId = this.whatsappTemplate.input.template;
      const contactListId = _createRecipient.data.data.id;
      const parameters = {
        body: [],
      };

      setTimeout(async function () {
        const _createBroadcast = await vm.$store.dispatch(
          "qontak/createBroadcast",
          { name: broadcastName, messageTemplateId, contactListId, parameters }
        );

        if (!_createBroadcast.success) {
          vm.createMessage.state = "error";
          vm.createMessage.value = "Unable to create broadcast";

          const _errors = _createBroadcast?.data?.message?.error?.messages;
          if (typeof _errors !== "undefined") {
            if (Array.isArray(_errors)) {
              vm.createMessage.error = _errors[0];
              if (typeof _errors[4] !== "undefined") {
                const errInfo = _errors[4].split(":");
                if (errInfo[0] === "rate_limit_reset") {
                  vm.createMessage.error += ` (wait after ${errInfo[1]} second) and then try again`;
                }
              }
              console.log(_errors);
            }
          }
          return;
        }

        vm.createMessage.state = "success";
        vm.createMessage.value = "Message has been successfully sent ";
      }, 3000);
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

      // set configuration
      this.whatsappTemplate.input.template =
        clientConfig.qontak_xero_invoice_template_id;
    },
    async updateQontakConfiguratoin() {
      // disable form
      this.forms.settings.disabled = true;

      //  request body
      const _request = {
        qontak_xero_invoice_template_id: this.whatsappTemplate.input.template,
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
      this.forms.settings.disabled = false;

      this.forms.settings.dialog = false;
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
      this.selectTemplate(this.whatsappTemplate.input.template);
    },
    selectTemplate(id) {
      this.$refs.inputSelectTemplate.blur();
      const templates = this.whatsappTemplate.rows;
      const selectedTemplate = templates.find((e) => e.id === id);

      this.whatsappTemplate.selected = selectedTemplate || null;
    },
  },
  mounted() {
    // get get configurations
    this.getConfigurations();

    // get whatsapp templates
    this.getWhatsappTemplate();

    // get tenant
    this.getTenant();
  },
};
</script>

<style lang="scss" scoped>
.full-height {
  min-height: calc(100vh - 200px);
}

.sync-loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #3498db;
  -webkit-animation: spin 2s linear infinite; /* Chrome, Opera 15+, Safari 5+ */
  animation: spin 2s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
  &:before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #e74c3c;
    -webkit-animation: spin 3s linear infinite; /* Chrome, Opera 15+, Safari 5+ */
    animation: spin 3s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
  }
  &:after {
    content: "";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #f9c922;
    -webkit-animation: spin 1.5s linear infinite; /* Chrome, Opera 15+, Safari 5+ */
    animation: spin 1.5s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
  }
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg); /* Chrome, Opera 15+, Safari 3.1+ */
    -ms-transform: rotate(0deg); /* IE 9 */
    transform: rotate(0deg); /* Firefox 16+, IE 10+, Opera */
  }
  100% {
    -webkit-transform: rotate(360deg); /* Chrome, Opera 15+, Safari 3.1+ */
    -ms-transform: rotate(360deg); /* IE 9 */
    transform: rotate(360deg); /* Firefox 16+, IE 10+, Opera */
  }
}
@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg); /* Chrome, Opera 15+, Safari 3.1+ */
    -ms-transform: rotate(0deg); /* IE 9 */
    transform: rotate(0deg); /* Firefox 16+, IE 10+, Opera */
  }
  100% {
    -webkit-transform: rotate(360deg); /* Chrome, Opera 15+, Safari 3.1+ */
    -ms-transform: rotate(360deg); /* IE 9 */
    transform: rotate(360deg); /* Firefox 16+, IE 10+, Opera */
  }
}
</style>