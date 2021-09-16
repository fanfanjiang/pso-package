import { SYS_FIELDS } from "../../const/form";
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