Ext.define('Kort.view.news.settings.AcceptedLanguagePanel', {
    extend: ('Ext.form.Panel'),
    config: {
        id: 'newsAcceptedLanguageSettingsPanel',
        centered : true,
        scrollable:true,
        width: '90%',
        height:'70%',
        modal    : true,
        items: [{
            xtype: 'fieldset',
            id: 'acceptedLanguageFieldSet',
            items: []
        },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    { xtype: 'spacer' },
                    {
                        xtype: 'button',
                        cls: 'accpetedLanguageSaveButton',
                        text: 'save'

                    },
                    { xtype: 'spacer' }
                ]
            }
        ]
    },
    initialize: function(){

        var acceptedLanguagesByUser = Ext.getStore('UserLocal').getData().all[0].get('newsAcceptedLanguageArray');

        var fieldset = Ext.getCmp('acceptedLanguageFieldSet');
        Kort.util.Config.getSupportedLanguages().forEach(function(element,index,array){
           fieldset.add({
               xtype: 'checkboxfield',
                name: element,
                label: Ext.i18n.Bundle.message(element),
                value: element,
                checked: acceptedLanguagesByUser.indexOf(element)!=-1
           })
        });
    }
})
