// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import Highcharts from 'highcharts';
import Arearange from 'highcharts/highcharts-more';
import Accessibility from 'highcharts/modules/accessibility';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import HighchartsVue from 'highcharts-vue';

Vue.use(HighchartsVue, Arearange);

Arearange(Highcharts);
Accessibility(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
