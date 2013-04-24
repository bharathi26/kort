/**
 * Controller for news tab
 */
Ext.define('Kort.controller.News', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'news.NavigationView',
            'news.newsEntry.Container',
            'news.settings.AcceptedLanguagePanel'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            newsNavigationView: '#newsNavigationView',
            newsRefreshButton: '#newsNavigationView .button[cls=newsRefreshButton]',
            newsSettingsButton: '#newsNavigationView .button[cls=newsSettingsButton]',
            accpetedLanguageSaveButton: '#newsAcceptedLanguageSettingsPanel .button[cls=accpetedLanguageSaveButton]',
            newsList: '.newslist'
        },
        control: {
            newsRefreshButton: {
                tap: 'refreshNews'
            },
            newsSettingsButton: {
                tap: 'onNewsSettingsButtonTap'
            },
            accpetedLanguageSaveButton: {
                tap: 'onAccpetedLanguageSaveButtonTap'
            },
            newsList: {
                itemtap: 'onNewsListItemTap'
            }

        },
        detailPushDisabled: false,
        newsLocalStore:null,
        settingsPanel:null

    },

    init: function() {
        var me = this;
        this.setNewsLocalStore(Ext.getStore('NewsLocal'));
        this.getNewsLocalStore().on('updaterecord',me.newsLocalStoreUpdated,me);
        //this.getNewsLocalStore().on('updateacceptedlanguages',)
        me.getApplication().on({
            geolocationready: { fn: me.refreshNews, scope: me }
        });
    },

    refreshNews: function() {
        console.log("refresh news");
        var me = this;
        this.getNewsLocalStore().load({
            callback:me.syncLocalNewsStoreWithRemoteNewsStore,
            scope: me
        });
    },

    syncLocalNewsStoreWithRemoteNewsStore: function() {
        var me = this;
        var newsRemoteStore = Ext.getStore('NewsRemote');
        newsRemoteStore.load({
            callback: function(records, operation, success) {
                records.forEach(function(element) {
                    if(me.getNewsLocalStore().findExact('newsid',element.data.newsid)==-1) {
                        //change model state to force sync to work properly
                        element.set('local',true);
                        me.getNewsLocalStore().add(element);
                    }
                });
                me.getNewsLocalStore().sync();
                me.getNewsLocalStore().load();
                me.newsLocalStoreUpdated();
            }
        });
    },

    newsLocalStoreUpdated: function() {
        this.getApplication().fireEvent('newsupdated');
    },

    acceptedLanguageUpdated: function() {

    },

    onNewsListItemTap: function(list, index, target, record, e) {

        var me = this,

            newsNavigationView = me.getNewsNavigationView(),
            newsNewsEntryContainer;

        // disable fast tapping
        if(!me.getDetailPushDisabled()) {
            me.setDetailPushDisabled(true);

            newsNewsEntryContainer = Ext.create('Kort.view.news.newsEntry.Container', {
                record: record,
                title: Ext.i18n.Bundle.message('news.title')
            })

            // reenable detail push after certain time
            Ext.defer(function() {
                me.setDetailPushDisabled(false);
            }, 1000);

            newsNavigationView.push(newsNewsEntryContainer);
            record.set('unread',false);
            this.getNewsLocalStore().sync();
            this.getNewsLocalStore().load();

        }
    },

    onNewsSettingsButtonTap: function() {
        this.setSettingsPanel(Ext.create('Kort.view.news.settings.AcceptedLanguagePanel'));
        Ext.Viewport.add(this.getSettingsPanel());
        this.getSettingsPanel().show();
    },

    onAccpetedLanguageSaveButtonTap: function() {
        var settingsValues = this.getSettingsPanel().getValues();
        var newAcceptedLanguageArray = [];
        Kort.util.Config.getSupportedLanguages().forEach(function(element,index,array) {
            if(settingsValues[element]) {
                newAcceptedLanguageArray.push(element);
            }
        });
        var localUserStore = Ext.getStore('UserLocal');
        localUserStore.getAt(0).set('newsAcceptedLanguageArray',newAcceptedLanguageArray);
        localUserStore.sync();
        this.getSettingsPanel().destroy();
        this.getNewsLocalStore().performAcceptedLanguageFiltering();
    }
});
