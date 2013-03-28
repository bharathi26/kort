/**
 * Select answer type for fix view
 */
Ext.define('Kort.view.bugmap.fix.type.Select', {
	extend: 'Ext.field.Select',
    
	config: {
        store: 'SelectAnswers',
        
        // always use Ext.picker.Picker
        usePicker: true,
        autoSelect: false,
        valueField: 'value',
        displayField: 'title',
        defaultPhonePickerConfig: {
            cancelButton: Ext.i18n.Bundle.message('picker.cancel'),
            doneButton: Ext.i18n.Bundle.message('picker.done')
        },
        defaultTabletPickerConfig: {
            cancelButton: Ext.i18n.Bundle.message('picker.cancel'),
            doneButton: Ext.i18n.Bundle.message('picker.done')
        },
        type: ''
	},
    
    initialize: function() {
        this.callParent(arguments);
        
        // filter answers for given type
        this.getStore().filter('type', this.getType());
    }
});
