import { SYS_FIELDS } from "../../const/form";
import Sortable from "sortablejs";
export const Search = {
    props: {
        instance: Object,
        store: Object,
    },
    data() {
        return {
            filterText: ""
        }
    },
    created() {
        for (let d of this.instance.data) {
            if (!d.display) {
                const exist = _.find(SYS_FIELDS, { _fieldValue: d.field_name });
                if (exist) {
                    d.display = exist._fieldName;
                }
            }
        }
    },
    computed: {
        fields() {
            return this.instance.data.filter((d) => {
                const f = this.store.searchByField(d.field_name);
                return f && this.filterField(d);
            });
        },
        sys_fields() {
            return this.instance.data.filter((d) => {
                const f = this.store.searchByField(d.field_name);
                return !f && this.filterField(d) && !/\S+_s$/.test(d.field_name) && !/\S+_x$/.test(d.field_name);
            });
        },
    },
    methods: {
        filterField(data) {
            return this.filterText ? data.field_name.indexOf(this.filterText) !== -1 || data.display.indexOf(this.filterText) !== -1 : true;
        },
    },
}

export const TableDrag = {
    data() {
        return {
            sortable: null,
        }
    },
    destroyed() {
        if (this.sortable) {
            this.sortable.destroy();
        }
    },
    methods: {
        initDrop(el, orderproxy) {
            this.sortable = Sortable.create(el, {
                animation: 180,
                delay: 0,
                onEnd: (evt) => {
                    console.log(evt);
                    const item = this.show_fields[evt.oldIndex];
                    const newItem = this.show_fields[evt.newIndex];
                    const preItem = this.show_fields[evt.newIndex - 1];
                    const nexItem = this.show_fields[evt.newIndex + 1];

                    const newOrder = evt.newIndex > evt.oldIndex ? newItem[orderproxy] + 1 : newItem[orderproxy] - 1;

                    if (evt.newIndex > evt.oldIndex && nexItem && nexItem[orderproxy] <= newOrder) {
                        this.show_fields.forEach((d, i) => {
                            if (i > evt.newIndex) {
                                d[orderproxy] = d[orderproxy] + (nexItem[orderproxy] === newOrder ? 1 : 2);
                            }
                        });
                    }

                    if (evt.newIndex < evt.oldIndex && preItem && preItem[orderproxy] >= newOrder) {
                        this.show_fields.forEach((d, i) => {
                            if (i < evt.newIndex) {
                                d[orderproxy] = d[orderproxy] - (preItem[orderproxy] === newOrder ? 1 : 2);
                            }
                        });
                    }

                    item[orderproxy] = newOrder;
                },
            });
        },
    }
}