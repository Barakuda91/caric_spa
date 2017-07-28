module.exports.caric = {

    /*-------------------CONFIGURATION_VARIABLES-----------------------------*/

    rootName: '/home/alex/work/caric_spa',
    templates: {
        addvBlocks: {
            small: '/assets/templates/addv-small-block.html',
            full: '/assets/templates/addv-full-block.html'
        }
    },
    secret: 'age64kg32bt',
    advertSettingParamFilters: {
        index: [
            'advertType', 'currency', 'price', 'diameter', 'wheelWidth',
            'pcd', 'wheelWidth', 'tyreWidth', 'tyreHeight', 'pcdSpacesFrom',
            'pcdSpacesTo', 'spacesWidth'
        ],
        list: [],
        all: []
    },
    defaultLanguage: 'ru',
    post_images_path: require('process').cwd()+'/post_store'
};
