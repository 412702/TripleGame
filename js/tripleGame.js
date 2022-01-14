/**
 * Author: Zhang Chunli、Zhang Yi、Zhang Zhong
 * From: Dalian University of Technology
 * Data: 2022-01-08
 * Encoding: uft-8
*/

/* 
    支付矩阵计算来源：
    
        王璐,杜露,张晨璐,张靖轩.突发公共卫生事件对分级诊疗的影响——基于博弈论的因素分析[J].现代医院管理,2021,19(04):56-60.
 */

// class相当于都是定义在原型对象上面呢

// 参与人，包含参与人名与参与人策略
class Player {
    constructor(p_name, p_strategy, p_current, p_v) {
        // 玩家名
        this.name = p_name;
        // 所有可选策略
        this.strategy_all = p_strategy;

        // 空值初始化
        // 当前策略
        if (p_current === undefined) {
            this.current_strategy = '';
        } else {
            this.current_strategy = p_current;
        }
        // 博弈收益 
        if (p_v === undefined) {
            this.value = 0
        } else {
            this.value = p_v
        }

    }

    toString() {
        return `${this.name}: {${this.strategy_all.toString()}} \n Current Strategy: ${this.current_strategy}`;
    }
}

// 三方博弈
class TripleGameEvolution {
    /**
     * player_list: [{
     *      name: '', strategy_all: ['', '']
     * }, ...]  OR to say
     *  player_list: [ new Player(), new Player() \, ......]
     * 
     * 
    */
    constructor(player_list, payoff_matrix, group_size, generation_size,
        variation_rate, death_rate, round_per_generation,
        proportion_of_triple_strategies,
        interation_stop) {
        // 三方博弈参与人，为Player数组，因为为三方博弈，长度必须为3
        if (player_list.length != 3) throw new Error("player_list size must be 3!");
        this.players = player_list;

        // 三方博弈支付矩阵，通过使用三方的策略取值的三维数组，取得值为收益列表，依次为三方收益，如：
        // 三方策略分别为A1, B1, C1, 支付payoff_matrix['A1']['B1']['C1'] = [1, 2, 3]
        this.PM = payoff_matrix;

        // 演化群体大小
        this.group = group_size;

        // 演化最大迭代代数
        this.generation = generation_size;

        // 演化过程中的变异率
        this.VR = variation_rate;

        // 每代演化的淘汰率
        this.DR = death_rate;

        // 每代演化过程中的随机对抗次数，随机博弈回合数。RPG
        this.RPG = round_per_generation;

        // 三方中各方策略占比，其中为三个数组，数组中值分别对应几个策略的占比情况，如果为空则均匀分配
        if (proportion_of_triple_strategies === undefined) {
            this.distributeProportionStrategies()
        } else {
            // 这里需要每一方的策略占比总和为1，如果不为1，那么最后一个策略则会占剩下部分
            this.PTSs = proportion_of_triple_strategies
        }

        // 迭代终止条件
        if (interation_stop === undefined) {
            // 
        } else {
            // 终止条件设置为某一团体的得分水平到达某一临界值时终止
            this.IS = interation_stop;
        }

        // 统计结果
        this.statistic = {};
        this.statistic[player_list[0].name] = []
        this.statistic[player_list[1].name] = []
        this.statistic[player_list[2].name] = []

    }
    /**
     * 均匀按照策略数目给出三方策略占比
     * */
    distributeProportionStrategies() {
        //  
        p_p_t_s = []
        for (let item of this.players) {
            let v = 1.0 / item.strategy_all.length
            let tmp_arr = []
            for (let i = 0; i < item.strategy_all.length; i++) {
                tmp_arr.push(v)
            }
            p_p_t_s.push(tmp_arr)
        }
        this.PTSs = p_p_t_s
    }

    /**
     * 初始化三方博弈群体
    */
    initTripleGroup() {
        // 建立三方博弈群体
        this.first_player_group = [];
        this.second_player_group = [];
        this.third_player_group = [];

        // 
        for (let i = 0; i < this.group; i++) {
            this.first_player_group.push(new Player(this.players[0].name, this.players[0].strategy_all, this.valueStrategyByProp(0)));
            this.second_player_group.push(new Player(this.players[1].name, this.players[1].strategy_all, this.valueStrategyByProp(1)));
            this.third_player_group.push(new Player(this.players[2].name, this.players[2].strategy_all, this.valueStrategyByProp(2)));
        }
    }

    /**
     * 对目标玩家按照给定的初始比例对策略进行取值
    */
    valueStrategyByProp(player_index) {
        let cumulation = 0;
        let rand = Math.random();
        let len = this.PTSs[player_index].length;

        // 这里不对最后一个进行累计
        for (let i = 0; i < len - 1; i++) {
            cumulation += this.PTSs[player_index][i];
            if (rand < cumulation) {
                return this.players[player_index].strategy_all[i];
            }
        }
        // 如果上面没有返回值，就返回最后一个策略
        return this.players[player_index].strategy_all[len - 1];
    }

    /**
     * 整个群体一个回合的随机对抗
    */
    battleOneRound() {
        // 对三方群体进行打乱shuffle，然后开始一个回合对抗
        // 为了方便操作，直接引用以下三方群体数组 
        let f = this.first_player_group;
        let s = this.second_player_group;
        let t = this.third_player_group;
        Util.shuffle(f);
        Util.shuffle(s);
        Util.shuffle(t);

        // 为简便操作
        let G = this.group
        let p = this.PM
        // 遍历各自的策略，开始对抗，对每个收益进行计算
        for (let i = 0; i < G; i++) {
            f[i].value += p[f[i].current_strategy][s[i].current_strategy][t[i].current_strategy][0];
            s[i].value += p[f[i].current_strategy][s[i].current_strategy][t[i].current_strategy][1];
            t[i].value += p[f[i].current_strategy][s[i].current_strategy][t[i].current_strategy][2];
        }
    }

    /**
     * 对群体数组按照value值进行降序排序，使用数组排序sort的接口
     * */
    sortGroup(p_1, p_2) {
        return p_2.value - p_1.value;
    }

    /**
     * 淘汰，复制与变异：进化
     * 按照淘汰率，对排名靠前的前m个进行复制替代排名靠后的后m个，
     * 并保持value不变的情况下，按照变异率对复制出来的后m个的策略进行变异
     * */
    envolution() {
        // 先对各个群体按照升序排序
        // 为了方便操作，直接引用以下三方群体数组 
        let f = this.first_player_group;
        let s = this.second_player_group;
        let t = this.third_player_group;

        let G = this.group;
        let v_r = this.VR;
        f.sort(this.sortGroup);
        s.sort(this.sortGroup);
        t.sort(this.sortGroup);

        // 需要复制的数目，向上取整；需要复制的数目为淘汰率
        let counter = Math.ceil(G * this.DR);

        // 对三方群体进行淘汰、复制与变异!
        // 这里保留意见：当对新产生一代进行复制的时候，value给0，还是直接对复制源value直接复制
        for (let i = 0; i < counter; i++) {
            let target = G - i - 1;
            f[target] = new Player(f[i].name, f[i].strategy_all, f[i].current_strategy, f[i].value);
            s[target] = new Player(s[i].name, s[i].strategy_all, s[i].current_strategy, s[i].value);
            t[target] = new Player(t[i].name, t[i].strategy_all, t[i].current_strategy, t[i].value);
            // 肯定是分别变异
            if (Math.random() < v_r) {
                f[target].current_strategy = f[target].strategy_all[Util.randint(0, f[target].strategy_all.length)];
            }

            if (Math.random() < v_r) {
                s[target].current_strategy = s[target].strategy_all[Util.randint(0, s[target].strategy_all.length)];
            }

            if (Math.random() < v_r) {
                t[target].current_strategy = t[target].strategy_all[Util.randint(0, t[target].strategy_all.length)];
            }
        }
        // 至此，新的一代群体产生 
    }

    /**
     * 开始演化入口
    */
    start() {
        // 先取值，避免频繁调用
        let Gen = this.generation;
        let Gro = this.group;
        let Round = this.RPG;

        // 根据博弈三方群体大小初始化三方群体，并选定初始策略
        this.initTripleGroup();

        // 一共演化Gen 代，每代进行Round回合对抗
        for (let i = 0; i < Gen; i++) {
            // 对每一代策略数目进行统计
            this.statisticStrategy();
            // 每代进行Round回合随机对抗并计算相应收益
            if((i+1)%100 == 0){
                console.log(`演化至第${i+1}代`)
            }
            
            for (let j = 0; j < Round; j++) {
                this.battleOneRound();
            }
            // Round 次对抗结束之后开始进行淘汰、复制和变异
            this.envolution();
        }
    }
    /**
     * 每代演化结果都需要统计
     * */
    statisticStrategy() {
        let f = this.first_player_group;
        let s = this.second_player_group;
        let t = this.third_player_group;

        this.statistic[f[0].name].push(Util.statisticPlayerList(f));
        this.statistic[s[0].name].push(Util.statisticPlayerList(s));
        this.statistic[t[0].name].push(Util.statisticPlayerList(t));
        
    }
}

class Util {
    /**
     * 产生索引数组，从from到to，闭区间
     * */
    static generateIndexArray(from, to) {
        let arr = []
        for (let i = from; i <= to; i++) {
            arr.push(i)
        }
        return arr
    }

    /**
     * 产生一个随机整数从from到to，左闭右开区间
     * */
    static randint(from, to) {
        return Math.floor(from + Math.random() * (to - from))
    }

    /**
     * 以随机乱序进行数组打乱
     * */
    static shuffle(arr) {
        let tmp = 0;
        let len = arr.length;
        // 一次循环换两个
        if (len < 2) return;
        for (let i = 0; i < Math.ceil(len / 2); i++) {
            let randint_1 = this.randint(0, len)
            tmp = arr[i]
            arr[i] = arr[randint_1]
            arr[randint_1] = tmp

            let randint_2 = this.randint(0, len)
            tmp = arr[len - 1 - i]
            arr[len - 1 - i] = arr[randint_2]
            arr[randint_2] = tmp
        }
        return arr;
    }

    // /
    static statisticPlayerList(player_list) {
        let res = {};
        for(let item of player_list){
            if(res[item.current_strategy] === undefined){
                res[item.current_strategy] = 1;
            }else{
                res[item.current_strategy]++;
            }
        }
        return res;
    }
}