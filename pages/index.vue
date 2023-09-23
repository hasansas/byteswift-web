<template>
  <v-container class="main-container">
    <v-card
      v-if="xeroAuth.access_token === ''"
      flat
      class="full-height d-flex justify-center align-center"
    >
      <v-card flat class="text-center">
        <img
          height="80"
          src="data:image/svg+xml,%3Csvg viewBox='0 0 45 46' xmlns='http://www.w3.org/2000/svg'%3E %3Ctitle%3EXero%3C/title%3E %3Cpath fill='%2313B5EA' d='M22.457 45.49c12.402 0 22.456-10.072 22.456-22.495C44.913 10.57 34.86.5 22.457.5 10.054.5 0 10.57 0 22.995 0 35.418 10.054 45.49 22.457 45.49' /%3E %3Cpath fill='%23FFFFFF' d='M10.75 22.935l3.832-3.85a.688.688 0 0 0-.977-.965l-3.83 3.833-3.845-3.84a.687.687 0 0 0-.966.979l3.832 3.837-3.83 3.84a.688.688 0 1 0 .964.981l3.84-3.842 3.825 3.827a.685.685 0 0 0 1.184-.473.68.68 0 0 0-.2-.485l-3.83-3.846m22.782.003c0 .69.56 1.25 1.25 1.25a1.25 1.25 0 0 0-.001-2.5c-.687 0-1.246.56-1.246 1.25m-2.368 0c0-1.995 1.62-3.62 3.614-3.62 1.99 0 3.613 1.625 3.613 3.62s-1.622 3.62-3.613 3.62a3.62 3.62 0 0 1-3.614-3.62m-1.422 0c0 2.78 2.26 5.044 5.036 5.044s5.036-2.262 5.036-5.043c0-2.78-2.26-5.044-5.036-5.044a5.046 5.046 0 0 0-5.036 5.044m-.357-4.958h-.21c-.635 0-1.247.2-1.758.595a.696.696 0 0 0-.674-.54.68.68 0 0 0-.68.684l.002 8.495a.687.687 0 0 0 1.372-.002v-5.224c0-1.74.16-2.444 1.648-2.63.14-.017.288-.014.29-.014.406-.015.696-.296.696-.675a.69.69 0 0 0-.69-.688m-13.182 4.127c0-.02.002-.04.003-.058a3.637 3.637 0 0 1 7.065.055H16.2zm8.473-.13c-.296-1.403-1.063-2.556-2.23-3.296a5.064 5.064 0 0 0-5.61.15 5.098 5.098 0 0 0-1.973 5.357 5.08 5.08 0 0 0 4.274 3.767c.608.074 1.2.04 1.81-.12a4.965 4.965 0 0 0 1.506-.644c.487-.313.894-.727 1.29-1.222.006-.01.014-.017.022-.027.274-.34.223-.826-.077-1.056-.254-.195-.68-.274-1.014.156-.072.104-.153.21-.24.315-.267.295-.598.58-.994.802-.506.27-1.08.423-1.69.427-1.998-.023-3.066-1.42-3.447-2.416a3.716 3.716 0 0 1-.153-.58l-.01-.105h7.17c.982-.022 1.51-.717 1.364-1.51z' /%3E %3C/svg%3E"
        />
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
                <v-icon size="18" class="mt-1 mr-2"> ri-layout-2-line </v-icon>
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
            :disabled="dataTable.rows.length === 0"
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
              $moment(dateStringToTimestamp(item.DueDate)).format("DD MMM YYYY")
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
    <v-dialog v-model="contacts.dialog" eager width="500">
      <!-- <v-toolbar flat>
        <v-toolbar-title> Send Messgae </v-toolbar-title>
      </v-toolbar> -->
      <v-card flat height="540" class="overflow-hidden">
        <v-container v-if="contacts.isLoading" class="fill-height">
          <v-row class="text-center">
            <v-col>
              <v-card flat height="220" class="mb-12">
                <v-container class="fill-height">
                  <v-row class="text-center">
                    <v-col>
                      <div class="sync-loader"></div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <div>
                <span v-if="createMessage.state === 'get_contact'">
                  Getting contact number:
                </span>
                {{ createMessage.value }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "IndexPage",
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
      },
    };
  },
  methods: {
    async loginXero() {
      const apiUrl = "https://login.xero.com/identity/connect/authorize";
      const responseType = "code";
      const clientId = "45B08F8BF1C04B09ACA01C20C037CBF5";
      const redirectUri = "http://localhost:3000/xero/callback";
      const scope =
        "openid profile email accounting.transactions offline_access";
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
      console.log("start");
      await this.getContact();
      console.log("end");
    },
    async getContact() {
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

          console.log(_contactData.Name);
          const _contactItem = {
            full_name: `${_contactData.FirstName} ${_contactData.LastName}`,
            customer_name: "",
            company: "",
          };
          contacts.push(_contactItem);
        }
      }

      this.createMessage.state = "create_contact_list";
      this.createMessage.value = "Creating contacts list";
    },
    getCreateCsv() {},
  },
  mounted() {
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