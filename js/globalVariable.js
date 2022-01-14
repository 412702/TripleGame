// 这里先给着全局变量来使用

const EvolutionParamters = {    
    // 三方演化博弈实例
    triple_game_evolution: null,
    // 支付矩阵
    payoff_matrix: null,
    // 三方玩家
    player_list: null,
    // 种群大小
    group_size: 0,
    // 演化代数
    generation_size: 0,
    // 变异率
    variation_rate: 0,
    // 淘汰率
    death_rate: 0,
    // 每代对抗次数
    round_per_generation: 0,
    // 三方博弈中各方每种纯策略占比
    proportion_of_triple_strategies: null,
    // 患者遵循分级诊疗获得医院推动分级诊疗时医疗服务水平得到提高等收益
    A1: 0,
    // 患者遵循分级诊疗获得医院推动分级诊疗时医疗服务水平得到提高等收益
    A2: 0,
    // 政府采取积极推动分级诊疗策略应对突发公共卫生事件时，遵循分级诊疗的民众对政府能力的认可和信任等收益
    B1: 0,
    // 政府采取积极推动分级诊疗策略应对突发公共卫生事件时，医院推动分级诊疗为政府带来的控制病情、稳定民心等收益
    B2: 0,
    // 政府积极推动分级诊疗的成
    C1: 0,
    // 政府消极推动分级诊疗的成本
    C2: 0,
    // 政府对分级诊疗采取消极态度，造成政府形象有损及事件恶化带来的损失
    D1: 0,
    // 政府对分级诊疗采取消极态度，造成政府形象有损及事件恶化带来的损失
    D2: 0,
    // 患者遵循分级诊疗所付出的成本
    e: 0,
    // 患者遵循分级诊疗所获得的收益
    E: 0,
    // 医院推动分级诊疗所付出的成本
    f: 0,
    // 医院推动分级诊疗所获得的收益
    F: 0,
    // 政府采取积极策略，医院阻碍分级诊疗面临的行政处罚等
    g: 0,
    // 政府采取积极策略，医院阻碍分级诊疗面临的行政处罚等
    G: 0,
    // 医院实施分级而患者因抵触不遵循分级诊疗时所付出转诊成本
    T: 0,
    // 三方博弈统计结果, res -> result
    statistic_result: [],
    // res_1st: null,
    // res_2nd: null,
    // res_3rd: null
}

const paramDom = {
    group_size: $('#param_group'),
    generation_size: $('#param_generate'),
    variation_rate: $('#param_variation'),
    death_rate: $('#param_death'),
    round_per_generation: $('#param_round'),
    A1: $('#param_A1'),
    A2: $('#param_A2'),
    B1: $('#param_B1'),
    B2: $('#param_B2'),
    C1: $('#param_C1'),
    C2: $('#param_C2') ,
    D1: $('#param_D1'),
    D2: $('#param_D2'),
    e:  $('#param_e'),
    E:  $('#param_E'),
    f:  $('#param_f'),
    F:  $('#param_F'),
    g:  $('#param_g'),
    G:  $('#param_G'),
    T:  $('#param_T'),

    start: $('#begin_game')
}