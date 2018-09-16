import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { CloudService } from "../common/services/cloud.services";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { DataTableDirectives } from 'angular2-datatable/datatable';
import { Response } from "../common/response/model/response";
import { AppGlobals } from "../common/globals/globals";
import * as _ from 'lodash';
import { DataFilterPipe } from './data-filter.pipe';
import { ReportService } from './services/reports.services';


@Component({
    selector: 'charts',
    templateUrl: './app/reports/charts.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, DataTableDirectives]
})
export class ChartsComponent implements OnInit {
    title = 'Gráficos';
    subtitle = 'Reportes gráficos';
    description_subtitle = 'Reportes Gráficos';

    public filterQuery = "";
    sub: any;
    error: any;
    response: Response;
    typeChart: string;
    public isRequesting: boolean = true;

    constructor(private appGlobals: AppGlobals, private route: ActivatedRoute, private reportService: ReportService) {
        this.response = new Response();
    }

    ngOnInit() {
        this.isRequesting = false;
        this.sub = this.route.params.subscribe(params => {
            if (params['type'] != -1) {
                this.typeChart = params['type'];
            }
        });

        this.getSalesByYear();

        //this.lineChart();
        //this.pieChart();
        //this.curveChart();
        //this.dynamicChart();
    }

    getSalesByYear() {
        var idCLinic = this.appGlobals.clinic.getValue().Id;
        this.response = new Response();
        this.reportService
            .getSalesByYear(idCLinic)
            .then(response => {
                this.response = response;
                this.barChart();
                this.isRequesting = false;
            })
            .catch(error => this.error = error);
    }

    barChart() {

        var ticks = [
            [0, "Enero"], [1, "Febrero"], [2, "Marzo"], [3, "Abril"], [4, "Mayo"], [5, "Junio"], [6, "Julio"], [7, "Agosto"], [8, "Septiembre"], [9, "Octubre"], [10, "Noviembre"], [11, "Diciembre"]
        ];

        var treatmentAmount = [];
        var payment = [];
        var owed = [];

        var i = 0;
        for (var item of this.response.Data) {
            treatmentAmount.push([i, item.TreatmentAmount]);
            payment.push([i, item.Payment]);
            owed.push([i, item.Owed]);
            i++;
        }
        
        var barData = new Array();
        barData.push({
            data: treatmentAmount,
            label: 'Presupuestado',
            bars: {
                show: true,
                barWidth: 0.08,
                order: 1,
                lineWidth: 0,
                fillColor: '#EDC240'
            }
        });

        barData.push({
            data: payment,
            label: 'Cobrado',
            bars: {
                show: true,
                barWidth: 0.08,
                order: 2,
                lineWidth: 0,
                fillColor: '#AFD8F8'
            }
        });

        barData.push({
            data: owed,
            label: 'Pendiente',
            bars: {
                show: true,
                barWidth: 0.08,
                order: 3,
                lineWidth: 0,
                fillColor: '#CB4B4B'
            }
        });

        /* Let's create the chart */
        if ($('#bar-chart')[0]) {
            $.plot($("#bar-chart"), barData, {
                grid: {
                    borderWidth: 1,
                    borderColor: '#eee',
                    show: true,
                    hoverable: true,
                    clickable: true
                },

                yaxis: {
                    tickColor: '#eee',
                    tickDecimals: 0,
                    font: {
                        lineHeight: 13,
                        style: "normal",
                        color: "#9f9f9f",
                    },
                    shadowSize: 0
                },

                xaxis: {
                    tickColor: '#fff',
                    ticks: ticks,
                    font: {
                        lineHeight: 13,
                        style: "normal",
                        color: "#9f9f9f"
                    },
                    shadowSize: 0,
                },

                legend: {
                    container: '.flc-bar',
                    backgroundOpacity: 0.5,
                    noColumns: 0,
                    backgroundColor: "white",
                    lineWidth: 0
                }
            });
        }

        /* Tooltips for Flot Charts */

        if ($(".flot-chart")[0]) {
            $(".flot-chart").bind("plothover", function (event, pos, item) {
                if (item) {
                    var y = item.datapoint[1].toFixed(2);
                    $(".flot-tooltip").html(item.series.label + ": " + y).css({ top: item.pageY + 5, left: item.pageX + 5 }).show();
                }
                else {
                    $(".flot-tooltip").hide();
                }
            });

            $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
        }
    }

    data = [];
    totalPoints = 100;
    updateInterval = 30;

    getRandomData() {
        if (this.data.length > 0)
            this.data = this.data.slice(1);

        while (this.data.length < this.totalPoints) {

            var prev = this.data.length > 0 ? this.data[this.data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 90) {
                y = 90;
            }

            this.data.push(y);
        }

        var res = [];
        for (var i = 0; i < this.data.length; ++i) {
            res.push([i, this.data[i]])
        }

        return res;
    }

    lineChart() {

        /* Make some random data for Flot Line Chart */

        var d1 = [];
        for (var i = 0; i <= 10; i += 1) {
            d1.push([i, parseInt(Math.random() * 30)]);
        }
        var d2 = [];
        for (var i = 0; i <= 20; i += 1) {
            d2.push([i, parseInt(Math.random() * 30)]);
        }
        var d3 = [];
        for (var i = 0; i <= 10; i += 1) {
            d3.push([i, parseInt(Math.random() * 30)]);
        }

        /* Chart Options */

        var options = {
            series: {
                shadowSize: 0,
                lines: {
                    show: false,
                    lineWidth: 0,
                },
            },
            grid: {
                borderWidth: 0,
                labelMargin: 10,
                hoverable: true,
                clickable: true,
                mouseActiveRadius: 6,

            },
            xaxis: {
                tickDecimals: 0,
                ticks: false
            },

            yaxis: {
                tickDecimals: 0,
                ticks: false
            },

            legend: {
                show: false
            }
        };

        /* Regular Line Chart */
        if ($("#line-chart")[0]) {
            $.plot($("#line-chart"), [
                { data: d1, lines: { show: true, fill: 0.98 }, label: 'Product 1', stack: true, color: '#e3e3e3' },
                { data: d3, lines: { show: true, fill: 0.98 }, label: 'Product 2', stack: true, color: '#FFC107' }
            ], options);
        }

        /* Recent Items Table Chart */
        if ($("#recent-items-chart")[0]) {
            $.plot($("#recent-items-chart"), [
                { data: this.getRandomData(), lines: { show: true, fill: 0.8 }, label: 'Items', stack: true, color: '#00BCD4' },
            ], options);
        }

        /* Tooltips for Flot Charts */

        if ($(".flot-chart")[0]) {
            $(".flot-chart").bind("plothover", function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    $(".flot-tooltip").html(item.series.label + " of " + x + " = " + y).css({ top: item.pageY + 5, left: item.pageX + 5 }).show();
                }
                else {
                    $(".flot-tooltip").hide();
                }
            });

            $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
        }
    }

    pieChart() {
        var pieData = [
            { data: 1, color: '#F44336', label: 'Toyota' },
            { data: 2, color: '#03A9F4', label: 'Nissan' },
            { data: 3, color: '#8BC34A', label: 'Hyundai' },
            { data: 4, color: '#FFEB3B', label: 'Scion' },
            { data: 4, color: '#009688', label: 'Daihatsu' },
        ];

        /* Pie Chart */

        if ($('#pie-chart')) {
            $.plot('#pie-chart', pieData, {
                series: {
                    pie: {
                        show: true,
                        stroke: {
                            width: 2,
                        },
                    },
                },
                legend: {
                    container: '.flc-pie',
                    backgroundOpacity: 0.5,
                    noColumns: 0,
                    backgroundColor: "white",
                    lineWidth: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 20,
                        y: 0
                    },
                    defaultTheme: false
                }

            });
        }

        /* Donut Chart */

        if ($('#donut-chart')[0]) {
            $.plot('#donut-chart', pieData, {
                series: {
                    pie: {
                        innerRadius: 0.5,
                        show: true,
                        stroke: {
                            width: 2,
                        },
                    },
                },
                legend: {
                    container: '.flc-donut',
                    backgroundOpacity: 0.5,
                    noColumns: 0,
                    backgroundColor: "white",
                    lineWidth: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 20,
                        y: 0
                    },
                    defaultTheme: false
                }

            });
        }
    }

    curveChart() {
        /* Make some random data for the Chart*/

        var d1 = [];
        for (var i = 0; i <= 10; i += 1) {
            d1.push([i, parseInt(Math.random() * 30)]);
        }
        var d2 = [];
        for (var i = 0; i <= 20; i += 1) {
            d2.push([i, parseInt(Math.random() * 30)]);
        }
        var d3 = [];
        for (var i = 0; i <= 10; i += 1) {
            d3.push([i, parseInt(Math.random() * 30)]);
        }

        /* Chart Options */

        var options = {
            series: {
                shadowSize: 0,
                curvedLines: { //This is a third party plugin to make curved lines
                    apply: true,
                    active: true,
                    monotonicFit: true
                },
                lines: {
                    show: false,
                    lineWidth: 0,
                },
            },
            grid: {
                borderWidth: 0,
                labelMargin: 10,
                hoverable: true,
                clickable: true,
                mouseActiveRadius: 6,

            },
            xaxis: {
                tickDecimals: 0,
                ticks: false
            },

            yaxis: {
                tickDecimals: 0,
                ticks: false
            },

            legend: {
                show: false
            }
        };

        /* Let's create the chart */

        if ($("#curved-line-chart")[0]) {
            $.plot($("#curved-line-chart"), [
                { data: d1, lines: { show: true, fill: 0.98 }, label: 'Product 1', stack: true, color: '#e3e3e3' },
                { data: d3, lines: { show: true, fill: 0.98 }, label: 'Product 2', stack: true, color: '#f1dd2c' }
            ], options);
        }

        /* Tooltips for Flot Charts */

        if ($(".flot-chart")[0]) {
            $(".flot-chart").bind("plothover", function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    $(".flot-tooltip").html(item.series.label + " of " + x + " = " + y).css({ top: item.pageY + 5, left: item.pageX + 5 }).show();
                }
                else {
                    $(".flot-tooltip").hide();
                }
            });

            $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
        }
    }

    dynamicChart() {
        /* Make some random data*/

        var data = [];
        var totalPoints = 300;
        var updateInterval = 30;

        function getRandomData() {
            if (data.length > 0)
                data = data.slice(1);

            while (data.length < totalPoints) {

                var prev = data.length > 0 ? data[data.length - 1] : 50,
                    y = prev + Math.random() * 10 - 5;
                if (y < 0) {
                    y = 0;
                } else if (y > 90) {
                    y = 90;
                }

                data.push(y);
            }

            var res = [];
            for (var i = 0; i < data.length; ++i) {
                res.push([i, data[i]])
            }

            return res;
        }

        /* Create Chart */

        if ($('#dynamic-chart')[0]) {
            var plot = $.plot("#dynamic-chart", [getRandomData()], {
                series: {
                    label: "Server Process Data",
                    lines: {
                        show: true,
                        lineWidth: 0.2,
                        fill: 0.6
                    },

                    color: '#00BCD4',
                    shadowSize: 0,
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    tickColor: '#eee',
                    font: {
                        lineHeight: 13,
                        style: "normal",
                        color: "#9f9f9f",
                    },
                    shadowSize: 0,

                },
                xaxis: {
                    tickColor: '#eee',
                    show: true,
                    font: {
                        lineHeight: 13,
                        style: "normal",
                        color: "#9f9f9f",
                    },
                    shadowSize: 0,
                    min: 0,
                    max: 250
                },
                grid: {
                    borderWidth: 1,
                    borderColor: '#eee',
                    labelMargin: 10,
                    hoverable: true,
                    clickable: true,
                    mouseActiveRadius: 6,
                },
                legend: {
                    container: '.flc-dynamic',
                    backgroundOpacity: 0.5,
                    noColumns: 0,
                    backgroundColor: "white",
                    lineWidth: 0
                }
            });
        }

        /* Update */
        function update() {
            plot.setData([getRandomData()]);
            // Since the axes don't change, we don't need to call plot.setupGrid()

            plot.draw();
            setTimeout(update, updateInterval);
        }
        update();
    }

}

