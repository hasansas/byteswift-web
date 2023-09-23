class XeroAuthModel {
  constructor() {
    this.model = {
      access_token: '',
      refresh_token: ''
    };
  }

  fromArray = async (items) => {
    let data = [];

    const promises = await items.map(async (item, k) => {
      let _item = await this.fromJson(item);
      data[k] = _item;
    });

    await Promise.all(promises);
    return data;
  };

  fromJson = async (item) => {
    if (typeof item == 'undefined') {
      return this.model;
    }

    let _item = Object.keys(this.model)
      .reduce((a, key) => (
        { ...a, [key]: item[key] ?? this.model[key] }
      ), {});

    return _item;
  }
}

module.exports = {
  XeroAuthModel: () => new XeroAuthModel(),
};
