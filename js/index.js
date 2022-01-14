/**
 * Author: Zhang Chunli、Zhang Yi、Zhang Zhong
 * From: Dalian University of Technology
 * Data: 2022-01-11
 * Encoding: uft-8
*/
$(function () {
    // 先安排上相应的监听器
    setElementListner();

    // 进入演化流程
    enterEvolution();

    // 绘制线图
    // drawLineChart('#line-chart',)

})


// 演化入口
function enterEvolution(params) {
    // 初始化演化参数，填到页面上去
    // initParamters();

    // 开始演化
    evolutionStart();

}
function showLoading(obj) {
    $('#load-data-request .box-title').text(obj.title)
    $('#load-data-request .box-body').text(obj.content);
    $('#load-data-request').show();
}

function hideLoading() {
    $('#load-data-request').hide();
}

// 从页面上获取演化参数进行开始演化
function evolutionStart() {
    showLoading({
        title: '模型准备中',
        content: '正在加载模型...',
    });

    // 给0.2延迟，并放进异步进程中，给页面UI点时间
    setTimeout(()=>{
        showLoading({
            title: '初始化参数',
            content: '参数输入模型...',
        });

        // 首次打开页面初始化参数
        EvolutionParamters.player_list = [
            new Player('Goverment', ['Positive_Policy', 'Negative_Policy']),
            new Player('Hospital', ['Promote_Scheme', 'Prevent_Scheme']),
            new Player('Patient', ['Obey_Rules', 'Disobey_Rules'])
        ];

        // 初始占比就随机吧
        EvolutionParamters.proportion_of_triple_strategies = randProportion(EvolutionParamters.player_list.length, EvolutionParamters.player_list[0].strategy_all.length)

        EvolutionParamters.group_size = paramDom.group_size.val();
        EvolutionParamters.generation_size = paramDom.generation_size.val();
        EvolutionParamters.round_per_generation = paramDom.round_per_generation.val();
        EvolutionParamters.variation_rate = paramDom.variation_rate.val()
        EvolutionParamters.death_rate = paramDom.death_rate.val();
        EvolutionParamters.A1 = paramDom.A1.val()
        EvolutionParamters.A2 = paramDom.A2.val()
        EvolutionParamters.B1 = paramDom.B1.val()
        EvolutionParamters.B2 = paramDom.B2.val()
        EvolutionParamters.C1 = paramDom.C1.val()
        EvolutionParamters.C2 = paramDom.C2.val()
        EvolutionParamters.D1 = paramDom.D1.val()
        EvolutionParamters.D2 = paramDom.D2.val()
        EvolutionParamters.e = paramDom.e.val()
        EvolutionParamters.E = paramDom.E.val()
        EvolutionParamters.f = paramDom.f.val()
        EvolutionParamters.F = paramDom.F.val()
        EvolutionParamters.g = paramDom.g.val()
        EvolutionParamters.G = paramDom.G.val()
        EvolutionParamters.T = paramDom.T.val()


        showLoading({
            title: '支付矩阵',
            content: '计算支付矩阵...',
        });
        // 如果支付矩阵直接赋值，而不是这么计算，那么就可以实现三方更多策略博弈。
        EvolutionParamters.payoff_matrix = caculatePayOffByParam();

        showLoading({
            title: '演化实例',
            content: '建立演化实例...',
        });
        EvolutionParamters.triple_game_evolution = new TripleGameEvolution(
            EvolutionParamters.player_list, EvolutionParamters.payoff_matrix,
            EvolutionParamters.group_size, EvolutionParamters.generation_size,
            EvolutionParamters.variation_rate, EvolutionParamters.death_rate,
            EvolutionParamters.round_per_generation,
            EvolutionParamters.proportion_of_triple_strategies
        )
        showLoading({
            title: '演化ing',
            content: '正在演化，请稍后...',
        });

        EvolutionParamters.triple_game_evolution.start();

        showLoading({
            title: '演化结束',
            content: '正在处理演化结果，请稍后...',
        });

        // 得到演化结果数据，把统计结果赋值给EvolutionParamters.statistic_result    
        dealResult();

        showLoading({
            title: '绘图ing',
            content: '正在绘图，请稍后...',
        });
        // 绘制线图
        drawLineChart('gover', EvolutionParamters.statistic_result[0])
        drawLineChart('hospital', EvolutionParamters.statistic_result[1])
        drawLineChart('patient', EvolutionParamters.statistic_result[2])
        hideLoading();
    }, 500);

    setTimeout(() => {
        hideLoading();
    }, 1000)
    
    
}

// 对统计结果进行抽取，去画图
function dealResult() {
    let sta = EvolutionParamters.triple_game_evolution.statistic;
    let p = EvolutionParamters.player_list;
    let result = []
    // 既然三方博弈直接用3了就
    for (let i = 0; i < 3; i++) {
        // 检查一下对不对先
        let name = p[i].name;
        let strategies = p[i].strategy_all;

        if (sta[name] === undefined) {
            throw new Error('Players something Wrong!');
        }

        let res = []
        for (let j = 0; j < sta[name].length; j++) {
            for (let strategy of strategies) {
                if (res[strategy] == undefined) {
                    res[strategy] = []
                }

                if (sta[name][j][strategy] === undefined) {
                    res[strategy].push([j, 0]);
                } else {
                    res[strategy].push([j, sta[name][j][strategy]]);
                }
            }
        }
        result.push(res);
    }
    EvolutionParamters.statistic_result = result;
}

function initParamters() {
    
    paramDom.group_size.val(300)
    paramDom.generation_size.val(1000)
    paramDom.round_per_generation.val(3);
    paramDom.variation_rate.val(0.001)
    paramDom.death_rate.val(0.01)
    paramDom.A1.val(7)
    paramDom.A2.val(5)
    paramDom.B1.val(7)
    paramDom.B2.val(5)
    paramDom.C1.val(6)
    paramDom.C2.val(2)
    paramDom.D1.val(7)
    paramDom.D2.val(4)
    paramDom.e.val(3)
    paramDom.E.val(5)
    paramDom.f.val(4)
    paramDom.F.val(6)
    paramDom.g.val(5)
    paramDom.G.val(6)
    paramDom.T.val(1)
}

function randProportion(row, col) {
    let result = []
    for (let i = 0; i < row; i++) {
        let res = []
        let r = Math.random();
        res.push(r);
        let sum = r;
        for (let j = 0; j < col - 2; j++) {
            let surplus = 1 - sum;
            let r_2 = surplus * Math.random();
            res.push(r_2);
            sum += r_2;
        }
        res.push(1 - sum);
        result.push(res);
    }
    // console.log(res)
    return result;
}

function caculatePayOffByParam() {
    let res = null;
    with (EvolutionParamters) {
        res = {
            Positive_Policy: {
                Promote_Scheme: {
                    Obey_Rules: [B1 + B2 - C1, F - f + G, E - e + A1 + A2],
                    Disobey_Rules: [B2 - C1, F - f + G, -T]
                },
                Prevent_Scheme: {
                    Obey_Rules: [B1 - C1, -g, E - e + A2],
                    Disobey_Rules: [-C1, -g, 0]
                }
            },
            Negative_Policy: {
                Promote_Scheme: {
                    Obey_Rules: [-C2 - D1 - D2, F - f, E - e + A1],
                    Disobey_Rules: [-C2 - D2, F - f, -T]
                },
                Prevent_Scheme: {
                    Obey_Rules: [-C2 - D1, 0, E - e],
                    Disobey_Rules: [-C2, 0, 0]
                }
            }
        };
        return res;
    }
}

// 设置元素监听器
function setElementListner() {
    paramDom.start.click(() => {
        evolutionStart();
    })
}


// 对Player数组中策略数目进行统计
function statisticPlayerList(player_list) {
    let res = {};
    for (let item of player_list) {
        if (res[item.current_strategy] === undefined) {
            res[item.current_strategy] = 1;
        } else {
            res[item.current_strategy]++;
        }
    }
    return res;
}

// 绘制线图
function drawLineChart(dom_id, input_data) {

    let colors = [
        ['#FF0000', '#3C8DBC', '#00C0EF', '#008000', '#FFC0CB', '#800080'],
        ['#FFB6C1', '#FF00FF', '#9370DB', '#00BFFF', '#00FF7F', '#228B22'],
        ['#808000', '#FFA500', '#FF4500', '#CD5C5C', '#00FF00', '#008B8B'],
    ]


    // var sin = [], cos = []
    // for (var i = 0; i < 14; i += 0.5) {
    //     sin.push([i, Math.sin(i)])
    //     cos.push([i, Math.cos(i)])
    // }
    // var line_data1 = {
    //     data: sin,
    //     color: '#FF0000'
    // }
    // var line_data2 = {
    //     data: cos,
    //     color: '#800080'
    // }


    let line_data = []
    let i = 0
    for (let key in input_data) {
        line_data.push({
            label: key,
            data: input_data[key],
            color: colors[Util.randint(0, 3)][Util.randint(0, 6)]
        })
    }
    $.plot(`#${dom_id}`, line_data, {
        // $.plot(dom_id, [line_data1, line_data2], {
        grid: {
            hoverable: true,
            borderColor: '#f3f3f3',
            borderWidth: 1,
            tickColor: '#f3f3f3'
        },
        series: {
            shadowSize: 0,
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        lines: {
            fill: false,
            color: ['#3c8dbc', '#f56954']
        },
        yaxis: {
            show: true
        },
        xaxis: {
            show: true
        }
    })
    //Initialize tooltip on hover
    $(`<div class="tooltip-inner" id="${dom_id}-tooltip"></div`).css({
        position: 'absolute',
        display: 'none',
        opacity: 0.8
    }).appendTo('body')
    $(`#${dom_id}`).bind('plothover', function (event, pos, item) {

        if (item) {
            var x = item.datapoint[0],
                y = item.datapoint[1]

            // $('#line-chart-tooltip').html(item.series.label + ' of ' + x + ' = ' + y)
            $(`#${dom_id}-tooltip`).html(`${item.series.label}  ${x} :${y}`)
                .css({ top: item.pageY + 5, left: item.pageX + 5 })
                .fadeIn(200)
        } else {
            $(`#${dom_id}-tooltip`).hide()
        }
    })

}