/**
 * Store for bugs
 */
Ext.define('Kort.store.Missions', {
    extend: 'Ext.data.Store',
	config: {
        autoLoad: false,
		model: 'Kort.model.Mission',
		proxy: {
			type: 'rest',
            url: './resources/stores/missions.json',
            pageParam: false,
            startParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage(),
                'limit': Kort.util.Config.getWebservices().bug.limit,
                'radius': Kort.util.Config.getWebservices().bug.radius
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}

});
