
export const CustomWf = {
    data() {
        return {
            customWf: []
        };
    },
    async created() {
        this.customWf = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 14, type: 1 } }) })).data;
    },
    methods: {
        checkCustomWf(map_key1, id) {
            const exist = _.find(this.customWf, { map_key1 });
            if (exist && exist.map_key2) {
                window.open(`${exist.map_key2}?insttogo=${id}`);
                return true
            }
            return;
        }
    }
};