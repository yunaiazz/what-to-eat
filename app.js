        // 状态
        let answers = {
            gender: '',  // 'female' = 小桃, 'male' = 小帅
            personality: '',  // 性格
            mood: '',
            body: '',
            taste: '',  // '咸' = 正餐, '甜' = 甜品, '都行' = 混合
            extra: ''
        };
        let recommendations = [];
        let customFoods = [];  // 用户自定义的食物
        let aiInsight = '';
        let isSpinning = false;

        // 配置
        let config = {
            apiKey: 'sk-1e84490f4cb542d09e6e944313ff091c',
            apiBase: 'https://api.deepseek.com'
        };

        // 关键词到 emoji 的映射（模糊匹配）
        const emojiKeywords = [
            // 主食类
            { keywords: ['火锅', '锅底'], emoji: '🍲' },
            { keywords: ['烧烤', '烤串', 'BBQ', '撸串'], emoji: '🍖' },
            { keywords: ['麻辣烫', '冒菜', '香锅', '干锅', '串串'], emoji: '🥘' },
            { keywords: ['炸鸡', '鸡排', '鸡翅', '鸡腿', '鸡块', '炸'], emoji: '🍗' },
            { keywords: ['鸡', '鸡肉', '白切鸡', '口水鸡', '辣子鸡', '黄焖鸡', '叫花鸡'], emoji: '🐔' },
            { keywords: ['面', '拉面', '米线', '粉', '螺蛳粉', '米粉', '肠粉', '河粉', '刀削面', '炸酱面', '热干面', '担担面', '凉面', '焖面'], emoji: '🍜' },
            { keywords: ['意面', '通心粉', '千层面'], emoji: '🍝' },
            { keywords: ['饺子', '馄饨', '抄手', '云吞', '锅贴', '包子', '小笼', '生煎', '灌汤包'], emoji: '🥟' },
            { keywords: ['粥', '稀饭', '泡饭'], emoji: '🥣' },
            { keywords: ['饭', '米饭', '炒饭', '盖浇', '卤肉饭', '煲仔饭', '拌饭', '咖喱饭', '蛋炒饭'], emoji: '🍚' },
            { keywords: ['饭团', '寿司饭', '紫菜包饭'], emoji: '🍙' },
            
            // 肉类
            { keywords: ['牛排', '牛肉', '牛腩', '牛腱', '肥牛', '雪花牛'], emoji: '🥩' },
            { keywords: ['猪', '红烧肉', '东坡肉', '回锅肉', '猪蹄', '猪脚', '排骨', '糖醋排骨', '五花肉'], emoji: '🍖' },
            { keywords: ['羊', '羊肉', '羊排', '羊蝎子', '涮羊肉', '烤全羊'], emoji: '🍖' },
            { keywords: ['肉夹馍', '夹馍', '肉饼'], emoji: '🥙' },
            
            // 海鲜
            { keywords: ['龙虾', '小龙虾', '大虾', '基围虾'], emoji: '🦞' },
            { keywords: ['蟹', '螃蟹', '大闸蟹', '帝王蟹', '蟹黄'], emoji: '🦀' },
            { keywords: ['虾', '白灼虾', '油焖虾', '虾仁', '虾饺'], emoji: '🦐' },
            { keywords: ['鱼', '三文鱼', '烤鱼', '酸菜鱼', '水煮鱼', '清蒸', '鳗鱼', '鲈鱼', '鲫鱼', '金枪鱼'], emoji: '🐟' },
            { keywords: ['海鲜', '贝', '蛤蜊', '生蚝', '牡蛎', '鲍鱼', '海参', '墨鱼', '鱿鱼', '章鱼', '八爪鱼'], emoji: '🦑' },
            
            // 禽类
            { keywords: ['鸭', '烤鸭', '盐水鸭', '酱鸭', '鸭血'], emoji: '🦆' },
            { keywords: ['鹅', '烧鹅', '卤鹅'], emoji: '🦢' },
            
            // 日韩料理
            { keywords: ['寿司', '刺身', '生鱼片', '手卷'], emoji: '🍣' },
            { keywords: ['定食', '便当', '套餐'], emoji: '🍱' },
            { keywords: ['烤肉', '和牛'], emoji: '🥩' },
            { keywords: ['泡菜', '石锅'], emoji: '🥬' },
            
            // 西餐快餐
            { keywords: ['披萨', '比萨', 'pizza'], emoji: '🍕' },
            { keywords: ['汉堡', '堡', 'burger'], emoji: '🍔' },
            { keywords: ['薯条', '薯', '土豆'], emoji: '🍟' },
            { keywords: ['三明治', '帕尼尼', '潜艇堡'], emoji: '🥪' },
            { keywords: ['热狗', '香肠'], emoji: '🌭' },
            { keywords: ['墨西哥', 'taco', '塔可'], emoji: '🌮' },
            { keywords: ['卷饼', '煎饼', '手抓饼', '鸡蛋灌饼'], emoji: '🌯' },
            { keywords: ['沙拉', '轻食', '健康餐', '减脂餐', '藜麦'], emoji: '🥗' },
            { keywords: ['牛油果', '鳄梨'], emoji: '🥑' },
            
            // 汤品
            { keywords: ['汤', '煲汤', '炖汤', '靓汤', '羊肉汤', '鸡汤', '骨头汤', '排骨汤', '银耳汤'], emoji: '🍲' },
            
            // 蛋类豆腐
            { keywords: ['蛋', '鸡蛋', '茶叶蛋', '卤蛋', '煎蛋', '蒸蛋', '炒蛋', '蛋包饭'], emoji: '🥚' },
            { keywords: ['豆腐', '豆花', '麻婆豆腐', '臭豆腐'], emoji: '🧈' },
            
            // 小吃
            { keywords: ['串', '烤串', '炸串', '关东煮'], emoji: '🍢' },
            { keywords: ['春卷', '蛋卷', '卷'], emoji: '🥠' },
            
            // 甜品
            { keywords: ['蛋糕', '芝士蛋糕', '提拉米苏', '慕斯', '千层', '甜点', '甜品'], emoji: '🍰' },
            { keywords: ['冰淇淋', '雪糕', '冰激凌', '圣代', '冰沙'], emoji: '🍦' },
            { keywords: ['布丁', '果冻', '仙草', '烧仙草'], emoji: '🍮' },
            { keywords: ['甜甜圈', '多纳圈'], emoji: '🍩' },
            { keywords: ['面包', '吐司', '可颂', '法棍', '贝果', '肉桂卷', '糕点'], emoji: '🥐' },
            { keywords: ['巧克力', '可可'], emoji: '🍫' },
            { keywords: ['饼干', '曲奇', 'cookie'], emoji: '🍪' },
            { keywords: ['糖', '糖果', '软糖'], emoji: '🍬' },
            { keywords: ['马卡龙', '法式', '泡芙'], emoji: '🧁' },
            
            // 饮品
            { keywords: ['奶茶', '珍珠', '波霸', '芋圆', '椰果'], emoji: '🧋' },
            { keywords: ['咖啡', '拿铁', '美式', '卡布奇诺', '摩卡', '浓缩', 'espresso'], emoji: '☕' },
            { keywords: ['茶', '绿茶', '红茶', '花茶', '乌龙', '普洱', '铁观音', '茉莉', '抹茶'], emoji: '🍵' },
            { keywords: ['果汁', '鲜榨', '橙汁', '西瓜汁', '柠檬水'], emoji: '🧃' },
            { keywords: ['奶昔', '冰沙', '思慕雪'], emoji: '🥤' },
            { keywords: ['奶', '牛奶', '酸奶', '豆浆', '豆奶'], emoji: '🥛' },
            { keywords: ['啤酒', '冰啤', '扎啤', '精酿'], emoji: '🍺' },
            { keywords: ['红酒', '葡萄酒', '白酒', '威士忌', '洋酒'], emoji: '🍷' },
            { keywords: ['鸡尾酒', '调酒', 'mojito'], emoji: '🍹' },
            
            // 坚果零食
            { keywords: ['坚果', '核桃', '杏仁', '腰果', '开心果', '花生', '瓜子'], emoji: '🥜' },
            { keywords: ['薯片', '零食', '膨化'], emoji: '🍿' },
            
            // 水果
            { keywords: ['水果', '果盘', '水果拼盘'], emoji: '🍇' },
            { keywords: ['苹果'], emoji: '🍎' },
            { keywords: ['橙', '橘', '柑'], emoji: '🍊' },
            { keywords: ['香蕉'], emoji: '🍌' },
            { keywords: ['西瓜'], emoji: '🍉' },
            { keywords: ['草莓'], emoji: '🍓' },
            { keywords: ['葡萄'], emoji: '🍇' },
            { keywords: ['桃', '水蜜桃'], emoji: '🍑' },
            { keywords: ['芒果'], emoji: '🥭' },
            { keywords: ['菠萝', '凤梨'], emoji: '🍍' },
            { keywords: ['椰子', '椰'], emoji: '🥥' },
            
            // 蔬菜素食
            { keywords: ['素', '素食', '素菜', '蔬菜', '青菜', '时蔬'], emoji: '🥬' },
            { keywords: ['玉米'], emoji: '🌽' },
            { keywords: ['番茄', '西红柿'], emoji: '🍅' },
            { keywords: ['辣椒', '青椒', '尖椒'], emoji: '🌶️' },
            { keywords: ['蘑菇', '菌', '香菇', '金针菇'], emoji: '🍄' },
            
            // 其他
            { keywords: ['下午茶', '英式'], emoji: '🫖' },
            { keywords: ['早餐', '早点', '早茶'], emoji: '🍳' },
            { keywords: ['夜宵', '宵夜', '深夜'], emoji: '🌙' },
            { keywords: ['自助', '自助餐', 'buffet'], emoji: '🍽️' }
        ];

        function init() {
            loadConfig();
        }

        // 选择性别（AI陪伴者）
        function selectGender(el, gender) {
            document.querySelectorAll('#page1 .mood-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
            answers.gender = gender;
            document.getElementById('nextBtn0').disabled = false;
        }

        // 跳转到性格选择页并显示对应选项
        function goToPersonality() {
            const isFemale = answers.gender === 'female';
            document.getElementById('femalePersonality').style.display = isFemale ? 'grid' : 'none';
            document.getElementById('malePersonality').style.display = isFemale ? 'none' : 'grid';
            document.getElementById('personalityLabel').textContent = isFemale ? '选择小桃的性格' : '选择小帅的性格';
            document.getElementById('personalityQuestion').textContent = isFemale ? '你喜欢什么样的小桃？' : '你喜欢什么样的小帅？';
            nextPage(2);
        }

        // 选择性格
        function selectPersonality(el, personality) {
            document.querySelectorAll('#page2 .mood-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
            answers.personality = personality;
            document.getElementById('nextBtnP').disabled = false;
        }

        // 选择心情
        function selectMood(el, mood) {
            document.querySelectorAll('#page3 .mood-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
            answers.mood = mood;
            document.getElementById('nextBtn1').disabled = false;
        }

        // 选择身体状态
        function selectBody(el, body) {
            document.querySelectorAll('#page4 .mood-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
            answers.body = body;
            document.getElementById('nextBtn2').disabled = false;
        }

        // 选择口味偏好
        function selectTaste(el, taste) {
            document.querySelectorAll('#page5 .mood-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
            answers.taste = taste;
            document.getElementById('nextBtn3').disabled = false;
        }

        // 页面切换
        function nextPage(num) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page' + num).classList.add('active');
            updateSteps(num);
        }

        function prevPage(num) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page' + num).classList.add('active');
            updateSteps(num);
        }

        function updateSteps(current) {
            for (let i = 1; i <= 7; i++) {
                const dot = document.getElementById('step' + i);
                if (!dot) continue;
                dot.classList.remove('active', 'done');
                if (i < current) dot.classList.add('done');
                if (i === current) dot.classList.add('active');
            }
        }

        // 开始AI分析
        async function startAnalysis() {
            answers.extra = document.getElementById('extraInput').value;
            nextPage(7);  // 跳转到AI分析页
            
            // 更新分析页面的文案
            const isFemale = answers.gender === 'female';
            document.getElementById('analyzingIcon').textContent = isFemale ? '👧' : '👦';
            document.getElementById('analyzingTitle').textContent = isFemale ? '小桃正在为你挑选美食~' : '小帅正在为你挑选美食~';

            if (!config.apiKey) {
                // 没有API Key，使用模拟数据
                setTimeout(() => {
                    useMockData();
                }, 2000);
                return;
            }

            try {
                const response = await callDeepSeek();
                parseAIResponse(response);
                nextPage(8);  // 跳转到结果页
            } catch (error) {
                console.error('API Error:', error);
                useMockData();
            }
        }

        // 性格描述映射
        const personalityDesc = {
            // 小桃的性格
            '温柔体贴': '说话温柔体贴，善解人意，总是用"呢"、"哦"、"嘛"等温柔语气词',
            '活泼可爱': '说话活泼俏皮，爱用"哈哈"、"嘻嘻"、"呀"、"啦"等可爱语气词，像个小太阳',
            '高冷傲娇': '表面高冷实则关心，会用"哼"、"才不是"、"随便你"等傲娇语气，但实际很在乎',
            '甜美撒娇': '说话甜甜的，爱撒娇，用"人家"、"嘛"、"好不好"、"讨厌啦"等撒娇语气',
            // 小帅的性格  
            '霸道总裁': '说话霸道但宠溺，用"听我的"、"我说了算"、"乖"等语气，强势但很暖',
            '阳光暖男': '说话温暖贴心，用"没事有我在"、"别担心"等暖心语气，像大哥哥一样照顾人',
            '高冷男神': '话不多但很在意，偶尔冷幽默，用简短但温柔的话关心人',
            '幽默搞笑': '说话风趣幽默，爱开玩笑，但玩笑中带着关心，让人开心'
        };

        // 调用 DeepSeek API
        async function callDeepSeek() {
            const isFemale = answers.gender === 'female';
            const name = isFemale ? '小桃' : '小帅';
            const personality = answers.personality;
            const pDesc = personalityDesc[personality] || '';
            
            const prompt = `你是${name}，${isFemale ? '一个女生' : '一个男生'}，性格是${personality}。${pDesc}。像${isFemale ? '女朋友' : '男朋友'}一样关心对方。

根据用户当前的状态，用你的人设和性格语气推荐适合的食物。

用户状态：
- 心情：${answers.mood}
- 身体状态：${answers.body}
- 补充说明：${answers.extra || '无'}

请用以下JSON格式回复（不要有其他内容）：
{
  "insight": "用你的性格语气（${personality}），一句话关心用户并说明推荐理由（40字以内）",
  "foods": ["食物1", "食物2", "食物3", ...]
}

要求：
1. insight 一定要体现${personality}的性格特点
2. 根据情绪科学推荐食物
3. foods 只填食物名称，简短
4. 推荐10-12个不同类型的食物
5. 【重要】每次推荐要有新意和变化，包含各种创意菜品、时令美食等
6. 【禁止】食物名称中不要包含任何国家、地区、城市名称，如"日式"、"韩式"、"法式"、"意式"、"泰式"、"越南"、"西班牙"、"土耳其"、"云南"、"港式"、"北京"、"扬州"等，只用食物本身的名字`;

            const res = await fetch(`${config.apiBase}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.95
                })
            });

            if (!res.ok) throw new Error('API request failed');
            
            const data = await res.json();
            return data.choices[0].message.content;
        }

        // 解析AI响应
        function parseAIResponse(response) {
            try {
                // 尝试提取JSON
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    aiInsight = data.insight || '根据你的状态，为你精选了以下美食';
                    recommendations = data.foods || [];
                }
            } catch (e) {
                console.error('Parse error:', e);
                useMockData();
                return;
            }

            renderResult();
        }

        // 健康食物数据库 - 包含推荐理由、搭配和健康提示
        const healthFoodData = {
            // 鱼类海鲜
            '三文鱼': { reason: '富含Omega-3脂肪酸，有助于改善情绪、保护心血管健康', pairing: ['藜麦饭', '芦笋', '柠檬水'], tip: '建议清蒸或轻煎，避免高温油炸以保留营养' },
            '清蒸鲈鱼': { reason: '高蛋白低脂肪，富含DHA，易消化吸收', pairing: ['糙米饭', '清炒时蔬', '紫菜汤'], tip: '清蒸保留最多营养，可加姜丝去腥增香' },
            '白灼虾': { reason: '优质蛋白来源，低脂低卡，富含锌和硒', pairing: ['蒜蓉西兰花', '杂粮饭', '冬瓜汤'], tip: '白灼是最健康的烹饪方式，搭配蘸料要少盐' },
            '深海鱼': { reason: 'EPA和DHA含量高，能缓解焦虑、改善大脑功能', pairing: ['地中海沙拉', '全麦面包', '橄榄油'], tip: '每周建议吃2-3次深海鱼，烹饪时少油少盐' },
            
            // 沙拉轻食
            '蔬菜沙拉': { reason: '富含膳食纤维和维生素，低热量高饱腹感', pairing: ['鸡胸肉', '全麦面包', '柠檬水'], tip: '选择橄榄油醋汁，避免高热量沙拉酱' },
            '牛油果沙拉': { reason: '牛油果富含不饱和脂肪酸，有助于心血管健康', pairing: ['藜麦', '樱桃番茄', '坚果'], tip: '牛油果热量较高，每次半个即可' },
            '地中海沙拉': { reason: '结合橄榄油、蔬菜和坚果，是公认的健康饮食模式', pairing: ['烤鸡胸', '全麦皮塔饼', '酸奶'], tip: '地中海饮食被证实能降低心血管疾病风险' },
            '藜麦沙拉': { reason: '藜麦是完全蛋白质，含全部必需氨基酸', pairing: ['烤蔬菜', '鹰嘴豆', '柠檬汁'], tip: '藜麦煮前要清洗去除苦味的皂苷' },
            
            // 粥品汤品
            '养生粥': { reason: '温和易消化，能养胃健脾，补充水分', pairing: ['蒸蛋', '凉拌黄瓜', '红枣'], tip: '可加入红枣、枸杞、山药等食材增加营养' },
            '银耳汤': { reason: '银耳富含胶质，能滋润肌肤、润肺养阴', pairing: ['红枣', '枸杞', '莲子'], tip: '银耳要泡发充分，小火慢炖才能出胶' },
            '参鸡汤': { reason: '温补元气，增强免疫力，缓解疲劳', pairing: ['糯米', '红枣', '枸杞'], tip: '体质燥热者不宜多食，建议秋冬季节食用' },
            '菌菇汤': { reason: '菌类富含多糖和膳食纤维，增强免疫力', pairing: ['豆腐', '青菜', '糙米饭'], tip: '多种菌菇搭配营养更全面' },
            '番茄蛋汤': { reason: '番茄红素抗氧化，鸡蛋补充优质蛋白', pairing: ['杂粮饭', '清炒时蔬', '水果'], tip: '番茄加热后番茄红素更易吸收' },
            
            // 主食
            '藜麦饭': { reason: '低GI主食，富含蛋白质和膳食纤维，稳定血糖', pairing: ['烤鸡胸', '蒸西兰花', '酸奶'], tip: '可与白米混合烹饪，口感更好' },
            '燕麦粥': { reason: '富含β-葡聚糖，能降低胆固醇、稳定血糖', pairing: ['蓝莓', '坚果', '牛奶'], tip: '选择原味燕麦片，避免加糖的即食麦片' },
            '荞麦面': { reason: '低GI粗粮，富含芦丁，有助于降血压', pairing: ['温泉蛋', '海苔', '葱花'], tip: '日式冷荞麦面更清淡健康' },
            '杂粮饭': { reason: '多种谷物搭配，营养均衡，增加膳食纤维', pairing: ['清蒸鱼', '凉拌菜', '海带汤'], tip: '杂粮比例可占1/3-1/2' },
            
            // 豆制品
            '豆腐料理': { reason: '优质植物蛋白，富含钙质和异黄酮', pairing: ['菌菇', '青菜', '糙米饭'], tip: '清蒸或凉拌最能保留营养' },
            '日式冷豆腐': { reason: '低热量高蛋白，清爽开胃，适合夏季', pairing: ['毛豆', '海苔', '酱油'], tip: '配上葱姜和柴鱼片，风味更佳' },
            
            // 蛋类
            '蒸蛋': { reason: '鸡蛋是完美蛋白质来源，蒸蛋最易消化', pairing: ['小米粥', '凉拌青菜', '水果'], tip: '蛋液与温水1:1.5比例，口感最嫩滑' },
            
            // 肉类（健康做法）
            '白切鸡': { reason: '鸡肉高蛋白低脂，白切保留原味营养', pairing: ['姜葱蘸料', '青菜', '米饭'], tip: '去皮食用可减少脂肪摄入' },
            '清炖牛肉': { reason: '牛肉富含铁质和B族维生素，补血益气', pairing: ['萝卜', '土豆', '面条'], tip: '选择瘦牛肉部位，去除表面油脂' },
            
            // 蔬菜
            '蒜蓉西兰花': { reason: '西兰花是超级蔬菜，富含维C和抗氧化物', pairing: ['鸡胸肉', '糙米饭', '番茄汤'], tip: '焯水时间不宜过长，保持脆嫩' },
            '凉拌木耳': { reason: '木耳富含铁和胶质，能清肠排毒', pairing: ['凉拌黄瓜', '小米粥', '蒸蛋'], tip: '干木耳要充分泡发，去除杂质' },
            '白灼菜心': { reason: '绿叶菜富含叶酸和维生素，清淡不腻', pairing: ['清蒸鱼', '米饭', '豆腐汤'], tip: '快速焯烫保持翠绿和营养' },
            
            // 饮品
            '绿茶': { reason: '茶多酚抗氧化，能提神醒脑、帮助消化', pairing: ['坚果', '水果', '全麦饼干'], tip: '空腹不宜喝浓茶，餐后1小时饮用最佳' },
            '洋甘菊茶': { reason: '有镇静安神作用，能缓解焦虑改善睡眠', pairing: ['蜂蜜', '柠檬', '全麦面包'], tip: '睡前30分钟饮用效果更好' },
            '酸奶': { reason: '富含益生菌，能改善肠道健康、增强免疫', pairing: ['燕麦', '蓝莓', '坚果'], tip: '选择无糖或低糖酸奶，避免过多添加糖' },
            '豆浆': { reason: '植物蛋白饮品，富含大豆异黄酮', pairing: ['全麦面包', '水煮蛋', '蔬菜'], tip: '建议选择无糖豆浆或自制' },
            
            // 坚果
            '坚果酸奶': { reason: '坚果富含不饱和脂肪酸，酸奶含益生菌', pairing: ['蓝莓', '燕麦', '蜂蜜'], tip: '每日坚果摄入量控制在30g左右' },
            
            // 水果
            '水果拼盘': { reason: '多种水果提供丰富维生素和抗氧化物', pairing: ['酸奶', '坚果', '燕麦'], tip: '选择应季水果，颜色越丰富越好' },
            
            // 其他健康食物
            '牛油果吐司': { reason: '健康脂肪搭配全麦碳水，饱腹感强', pairing: ['水波蛋', '樱桃番茄', '咖啡'], tip: '选择全麦或杂粮吐司更健康' },
            '奇亚籽布丁': { reason: '奇亚籽富含Omega-3和膳食纤维', pairing: ['蓝莓', '杏仁奶', '蜂蜜'], tip: '奇亚籽需要充分吸水膨胀后食用' },
            '鹰嘴豆泥': { reason: '优质植物蛋白和膳食纤维来源', pairing: ['全麦皮塔饼', '蔬菜条', '橄榄油'], tip: '自制可控制油和盐的用量' },
            
            // 补充更多常见食物的健康信息
            '鸡汤面': { reason: '鸡汤温补，面条易消化，能快速恢复体力', pairing: ['蔬菜', '鸡蛋', '葱姜'], tip: '撇去表面油脂，减少脂肪摄入' },
            '日式定食': { reason: '少油少盐，搭配均衡，是健康饮食典范', pairing: ['味噌汤', '腌渍小菜', '绿茶'], tip: '细嚼慢咽，八分饱即可' },
            '素食简餐': { reason: '植物性饮食富含纤维，对心血管有益', pairing: ['豆腐', '蔬菜', '糙米'], tip: '注意补充B12和优质蛋白' },
            '花茶': { reason: '花草茶有舒缓情绪、美容养颜的功效', pairing: ['坚果', '水果干', '全麦饼干'], tip: '根据体质选择适合的花茶种类' },
            '抹茶拿铁': { reason: '抹茶富含茶多酚和L-茶氨酸，能提神又安神', pairing: ['全麦面包', '水果', '坚果'], tip: '选择无糖或少糖版本更健康' },
            '香蕉奶昔': { reason: '香蕉富含钾和色氨酸，能改善情绪和睡眠', pairing: ['燕麦', '坚果', '蜂蜜'], tip: '用牛奶或杏仁奶代替冰淇淋' },
            '希腊酸奶': { reason: '蛋白质含量高，益生菌丰富，低糖低脂', pairing: ['蜂蜜', '坚果', '蓝莓'], tip: '选择原味，自己添加水果和蜂蜜' },
        };

        // 默认健康建议池 - 随机选择
        const defaultReasons = [
            '这道美食能满足味蕾，适量享用有助于愉悦心情',
            '美食是治愈心灵的良药，享受当下的美味吧',
            '偶尔放纵一下也是生活的调味剂，开心最重要',
            '食物带来的满足感能让大脑分泌多巴胺，让你更快乐',
            '好好吃饭是对自己最好的关爱，值得认真对待',
            '美味的食物能带来幸福感，今天你值得拥有',
            '享受美食的过程本身就是一种放松和疗愈',
            '适当满足口腹之欲，有助于保持好心情',
            '人生苦短，美食不可辜负，好好享用吧',
            '食物是最简单的幸福来源，细细品味吧'
        ];
        const defaultPairings = [
            ['蔬菜沙拉', '水果', '清茶'],
            ['凉拌黄瓜', '酸奶', '柠檬水'],
            ['清炒时蔬', '玉米汁', '水果'],
            ['番茄汤', '全麦面包', '鲜榨果汁'],
            ['蒜蓉西兰花', '小米粥', '水果'],
            ['凉拌木耳', '绿豆汤', '坚果'],
            ['白灼青菜', '银耳汤', '苹果'],
            ['海带丝', '红枣茶', '香蕉'],
            ['蒸南瓜', '豆浆', '蓝莓'],
            ['清炒豆芽', '山药粥', '橙子']
        ];
        const defaultTips = [
            '建议荤素搭配，细嚼慢咽，享受美食的同时注意均衡营养',
            '吃饭时放下手机，专注品味食物的味道会更幸福',
            '七八分饱刚刚好，给胃留点空间更舒适',
            '饭后散步十分钟，有助于消化和保持好身材',
            '多喝水有助于新陈代谢，饭前一杯水更健康',
            '慢慢吃，让大脑有时间接收饱腹信号',
            '搭配一些蔬菜水果，营养更均衡哦',
            '享受美食的同时别忘了适量运动，保持活力',
            '用心感受食物的色香味，这是生活的小确幸',
            '和喜欢的人一起吃饭，食物会更美味',
            '保持愉快的心情用餐，有助于消化吸收',
            '偶尔的美食犒赏是对努力生活的自己的奖励'
        ];

        // 获取食物的健康信息（包含默认处理）
        function getHealthInfo(food) {
            if (healthFoodData[food]) {
                return healthFoodData[food];
            }
            // 模糊匹配
            for (const key in healthFoodData) {
                if (food.includes(key) || key.includes(food)) {
                    return healthFoodData[key];
                }
            }
            // 随机默认健康建议
            return {
                reason: defaultReasons[Math.floor(Math.random() * defaultReasons.length)],
                pairing: defaultPairings[Math.floor(Math.random() * defaultPairings.length)],
                tip: defaultTips[Math.floor(Math.random() * defaultTips.length)]
            };
        }

        // 显示健康信息 - 调用DeepSeek生成
        async function showHealthInfo(food) {
            const isFemale = answers.gender === 'female';
            const name = isFemale ? '小桃' : '小帅';
            const personality = answers.personality;
            
            // 先显示加载状态
            document.getElementById('aiInsight').innerHTML = `
                <div style="margin-bottom:8px;">🎉 <strong>今天就吃${food}吧！</strong></div>
                <div style="color:#999;">${name}正在为你查询健康信息<span class="loading-dots"><span></span><span></span><span></span></span></div>
            `;
            
            // 如果没有API Key，使用本地数据
            if (!config.apiKey) {
                const info = getHealthInfo(food);
                renderHealthInfo(food, info);
                return;
            }
            
            try {
                const prompt = `你是${name}，性格是${personality}。用户选择了吃「${food}」，请用你的性格语气给出健康饮食建议。

请用以下JSON格式回复（不要有其他内容）：
{
  "reason": "为什么推荐这道食物，营养价值或心情方面的好处（30字以内，体现${personality}性格）",
  "pairing": ["搭配食物1", "搭配食物2", "搭配食物3"],
  "tip": "一句健康小贴士或温馨提醒（30字以内，体现${personality}性格）"
}

要求：
1. 内容要有新意，不要总是重复相同的建议
2. pairing推荐3个适合搭配的食物或饮品
3. 语气要符合${personality}的性格特点`;

                const res = await fetch(`${config.apiBase}/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.9
                    })
                });

                if (!res.ok) throw new Error('API request failed');
                
                const data = await res.json();
                const content = data.choices[0].message.content;
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                
                if (jsonMatch) {
                    const info = JSON.parse(jsonMatch[0]);
                    renderHealthInfo(food, info);
                } else {
                    throw new Error('Invalid response');
                }
            } catch (e) {
                console.error('Health info API error:', e);
                // 降级到本地数据
                const info = getHealthInfo(food);
                renderHealthInfo(food, info);
            }
        }
        
        // 渲染健康信息
        function renderHealthInfo(food, info) {
            const pairingText = info.pairing.map(p => getEmoji(p) + p).join('、');
            const healthContent = `
                <div style="margin-bottom:8px;">🎉 <strong>今天就吃${food}吧！</strong></div>
                <div style="margin-bottom:6px;">💡 ${info.reason}</div>
                <div style="margin-bottom:6px;">🍽️ 推荐搭配：${pairingText}</div>
                <div>✨ ${info.tip}</div>
            `;
            document.getElementById('aiInsight').innerHTML = healthContent;
        }

        // 隐藏健康信息（重置为原始状态）
        function hideHealthInfo() {
            document.getElementById('aiInsight').textContent = aiInsight;
        }

        // 使用模拟数据
        function useMockData() {
            const isFemale = answers.gender === 'female';
            const personality = answers.personality;
            
            // 健康化食物池 - 减少油炸高糖食物，增加健康选项
            const foodPool = {
                '开心': [
                    '海鲜刺身', '清蒸鱼', '寿司', '河粉', '牛油果沙拉', '蔬菜沙拉', '鸡肉卷',
                    '三文鱼', '白灼虾', '烤鸡胸', '藜麦饭', '早茶点心', '清炖牛肉', '烤牛排',
                    '蒸蛋', '水果拼盘', '酸奶', '坚果酸奶', '绿茶', '花茶', '鲜榨果汁',
                    '虾仁炒饭', '蟹肉粥', '鳗鱼饭', '牛肉面', '鸡丝凉面', '小笼包', '虾饺',
                    '烤三文鱼', '香煎鳕鱼', '蒜蓉蒸扇贝', '椒盐虾', '糖醋里脊', '宫保鸡丁',
                    '木须肉', '青椒肉丝', '鱼香肉丝', '回锅肉', '红烧排骨', '蒜香排骨'
                ],
                '疲惫': [
                    '鸡汤', '鸡汤面', '养生粥', '银耳莲子羹', '红枣桂圆汤', '菌菇汤', '番茄蛋汤',
                    '清蒸鲈鱼', '白切鸡', '蒸蛋', '藜麦饭', '燕麦粥', '小米粥', '山药排骨汤',
                    '豆浆', '牛奶', '蜂蜜水', '花茶', '红糖姜茶', '枸杞茶', '椰子鸡', '花胶鸡',
                    '当归鸡汤', '黄芪炖鸡', '乌鸡汤', '猪肚鸡', '羊肉汤', '牛肉汤', '排骨汤',
                    '八宝粥', '皮蛋瘦肉粥', '海鲜粥', '虾仁粥', '南瓜粥', '红豆粥', '绿豆粥',
                    '蒸饺', '馄饨', '云吞面', '牛腩面', '猪脚饭', '卤肉饭', '鸡腿饭'
                ],
                '焦虑': [
                    '三文鱼', '深海鱼', '牛油果沙拉', '藜麦沙拉', '蔬菜沙拉', '坚果酸奶', '酸奶',
                    '燕麦粥', '香蕉奶昔', '绿茶', '菊花茶', '薰衣草茶', '抹茶拿铁', '奇亚籽布丁',
                    '清蒸鲈鱼', '白灼菜心', '蒜蓉西兰花', '凉拌木耳', '芦笋沙拉', '牛油果吐司',
                    '核桃仁', '杏仁', '腰果', '开心果', '蓝莓', '草莓', '樱桃', '葡萄',
                    '豆腐脑', '凉拌豆腐', '清炒时蔬', '蒸南瓜', '蒸红薯', '玉米', '毛豆',
                    '薏米粥', '莲子羹', '百合银耳汤', '雪梨汤', '冰糖雪梨', '罗汉果茶'
                ],
                '低落': [
                    '鸡汤', '香蕉奶昔', '热牛奶', '燕麦粥', '坚果酸奶', '水果拼盘', '酸奶',
                    '三文鱼', '清蒸鱼', '鸡汤面', '蒸蛋', '养生粥', '银耳汤', '红枣桂圆汤',
                    '抹茶拿铁', '花茶', '蜂蜜柚子茶', '热可可', '全麦面包', '牛油果吐司', '坚果',
                    '芝士蛋糕', '提拉米苏', '巧克力慕斯', '草莓蛋糕', '舒芙蕾', '布丁', '冰淇淋',
                    '红豆汤', '芋圆', '豆花', '杨枝甘露', '芒果西米露', '椰汁西米露',
                    '糯米鸡', '叉烧包', '蛋挞', '菠萝包', '奶黄包', '流沙包', '糖水'
                ],
                '平静': [
                    '清淡套餐', '蔬菜沙拉', '清蒸鱼', '素食简餐', '养生粥', '豆腐料理', '荞麦面',
                    '白灼虾', '蒸蛋', '银耳汤', '水果拼盘', '花茶', '凉拌豆腐', '凉拌黄瓜',
                    '白切鸡', '藜麦饭', '菌菇汤', '番茄蛋汤', '燕麦粥', '酸奶', '绿茶',
                    '清炒豆苗', '蒜蓉油麦菜', '白灼生菜', '凉拌海带', '凉拌莴笋', '凉拌藕片',
                    '素炒三丝', '清炒西芹', '蚝油生菜', '香菇青菜', '口蘑炒肉', '素什锦',
                    '紫菜蛋花汤', '冬瓜汤', '丝瓜汤', '白萝卜汤', '海带豆腐汤', '西红柿鸡蛋面'
                ],
                '兴奋': [
                    '清蒸海鲜', '白灼虾', '三文鱼', '烤鸡胸', '蔬菜沙拉', '藜麦沙拉', '清淡套餐',
                    '河粉', '凉拌沙拉', '凉拌木耳', '蒜蓉西兰花', '清蒸鱼', '菌菇汤',
                    '酸奶', '鲜榨果汁', '绿茶', '花茶', '坚果', '水果拼盘', '牛油果沙拉',
                    '烤羊排', '烤鸡翅', '盐焗鸡', '口水鸡', '手撕鸡', '柠檬鸡', '咖喱鸡',
                    '黑椒牛柳', '蒜香牛肉', '酱牛肉', '卤牛肉', '水煮牛肉', '干煸牛肉丝',
                    '蒜蓉龙虾', '清蒸螃蟹', '蒜蓉扇贝', '烤生蚝', '蛏子', '花甲', '海鲜拼盘'
                ]
            };
            
            // 随机打乱并取12个
            function shuffleAndPick(arr, count) {
                const shuffled = [...arr].sort(() => Math.random() - 0.5);
                return shuffled.slice(0, count);
            }
            
            const mood = answers.mood || '平静';
            const pool = foodPool[mood] || foodPool['平静'];

            // 不同性格的语气模板
            const insightTemplates = {
                // 小桃的性格
                '温柔体贴': {
                    '开心': '你开心我就安心了呢，那就吃点好的犒劳自己吧～',
                    '疲惫': '累了呀...要好好休息，吃点暖暖的补补身体哦',
                    '焦虑': '别担心嘛，深呼吸，吃点让心情平静的食物呢',
                    '低落': '抱抱你，不开心的时候就要对自己好一点呀',
                    '平静': '心情平静真好呢，那就吃点清淡养生的吧',
                    '兴奋': '哇你好开心呀！那就吃点刺激的庆祝一下吧'
                },
                '活泼可爱': {
                    '开心': '哈哈太棒啦！开心就要吃好吃的呀，走走走！',
                    '疲惫': '哎呀累了呀～快快吃点好吃的补充能量！加油！',
                    '焦虑': '嘿嘿别紧张啦～吃点好吃的就不焦虑了！相信我！',
                    '低落': '不许不开心哦！吃甜甜的心情就会变好啦～',
                    '平静': '嘻嘻～那就吃点清淡的，养生养生！',
                    '兴奋': '耶耶耶！那就吃辣的嗨起来！冲冲冲！'
                },
                '高冷傲娇': {
                    '开心': '哼，难得看你这么开心，那就勉强推荐几个吧',
                    '疲惫': '...累了就说累了嘛，我才不是担心你呢，快吃点补补',
                    '焦虑': '切，有什么好焦虑的，吃点这些就好了，才不是为你选的',
                    '低落': '哼，不许不开心，吃点甜的...我才没有心疼你',
                    '平静': '还行吧，那就吃清淡点好了，对身体好...随便你',
                    '兴奋': '这么兴奋干嘛，好吧想吃辣就吃吧，我允许了'
                },
                '甜美撒娇': {
                    '开心': '宝贝心情好好呀～人家给你选了好吃的，喜欢嘛～',
                    '疲惫': '心疼你啦～乖乖吃饭饭补充能量好不好嘛～',
                    '焦虑': '别紧张嘛亲爱的～吃点好吃的就不怕怕了呢～',
                    '低落': '呜呜不要不开心啦～吃甜甜的心情会变好的嘛～',
                    '平静': '嗯嗯～那人家给你选清淡养生的好不好呀～',
                    '兴奋': '哇好开心呀！那就吃辣辣的庆祝一下嘛～讨厌啦～'
                },
                // 小帅的性格
                '霸道总裁': {
                    '开心': '不错，心情好。今天我请客，听我的准没错',
                    '疲惫': '累了？乖，我说吃什么就吃什么，给我好好补补',
                    '焦虑': '别怕，有我在。吃这些，我说了你就不会焦虑',
                    '低落': '不许不开心，我不允许。吃完这些给我笑一个',
                    '平静': '嗯，保持这状态。吃清淡点，对身体好，听话',
                    '兴奋': '行，今天放纵一下。想吃辣的？我带你去'
                },
                '阳光暖男': {
                    '开心': '你开心我就开心，今天带你吃点好的庆祝一下～',
                    '疲惫': '累了吧？别担心有我在，好好吃饭补充能量',
                    '焦虑': '没事的，别担心，一切都会好的，先吃点东西放松放松',
                    '低落': '怎么不开心了？没关系有我陪你，吃点好吃的吧',
                    '平静': '状态不错呀，那就吃点清淡的养养生吧',
                    '兴奋': '哈哈这么开心啊！走，今天放开吃！'
                },
                '高冷男神': {
                    '开心': '嗯，心情不错。吃这些',
                    '疲惫': '...吃点补的。别太累了',
                    '焦虑': '放松。吃完这些会好一些',
                    '低落': '吃点甜的。不许不开心',
                    '平静': '挺好。吃清淡点',
                    '兴奋': '行。想吃辣就吃吧'
                },
                '幽默搞笑': {
                    '开心': '哟呵心情不错嘛！那必须整点好的，干饭人干饭魂！',
                    '疲惫': '累成狗了吧哈哈～来来来补补能量，元气满满再出发！',
                    '焦虑': '焦虑啥呀，天塌下来有高个顶着！先吃饱再说！',
                    '低落': 'emo了？没事没事，吃顿好的，什么烦恼都忘掉！',
                    '平静': '佛系青年今天想吃清淡的？安排！养生走起～',
                    '兴奋': '这么嗨皮？那必须整点辣的助助兴！冲鸭！'
                }
            };

            const templates = insightTemplates[personality] || insightTemplates['温柔体贴'];
            
            aiInsight = templates[mood] || templates['平静'];
            recommendations = shuffleAndPick(pool, 12);
            renderResult();
            nextPage(7);
        }

        // 渲染结果
        function renderResult() {
            const isFemale = answers.gender === 'female';
            const name = isFemale ? '小桃' : '小帅';
            const labelEl = document.querySelector('.ai-insight-label');
            labelEl.innerHTML = isFemale ? `👧 ${name}说` : `👦 ${name}说`;
            
            document.getElementById('aiInsight').textContent = aiInsight;
            
            // 清空自定义食物
            customFoods = [];
            
            renderFoodTags();
        }
        
        // 渲染食物标签
        function renderFoodTags() {
            const tagsContainer = document.getElementById('recTags');
            const allFoods = [...recommendations, ...customFoods];
            
            tagsContainer.innerHTML = allFoods.map((f, idx) => {
                const isCustom = idx >= recommendations.length;
                if (isCustom) {
                    return `<div class="rec-tag custom">${getEmoji(f)} ${f}<button class="remove-btn" onclick="removeCustomFood(${idx - recommendations.length})">×</button></div>`;
                }
                return `<div class="rec-tag">${getEmoji(f)} ${f}</div>`;
            }).join('');
        }
        
        // 添加自定义食物
        function addCustomFood() {
            const input = document.getElementById('customFoodInput');
            const food = input.value.trim();
            
            if (food && food.length <= 20) {
                // 检查是否已存在
                if (!recommendations.includes(food) && !customFoods.includes(food)) {
                    customFoods.push(food);
                    renderFoodTags();
                }
                input.value = '';
            }
        }
        
        // 移除自定义食物
        function removeCustomFood(index) {
            customFoods.splice(index, 1);
            renderFoodTags();
        }

        function getEmoji(food) {
            // 模糊匹配：遍历关键词列表，找到包含任意关键词的匹配
            for (const item of emojiKeywords) {
                for (const keyword of item.keywords) {
                    if (food.includes(keyword) || keyword.includes(food)) {
                        return item.emoji;
                    }
                }
            }
            return '🍽️';
        }

        // 老虎机抽取
        function spinSlot() {
            const allFoods = [...recommendations, ...customFoods];
            if (isSpinning || allFoods.length === 0) return;
            
            isSpinning = true;
            const btn = document.getElementById('spinBtn');
            const slotItems = document.getElementById('slotItems');
            const tags = document.querySelectorAll('.rec-tag');
            
            btn.disabled = true;
            btn.textContent = '抽取中...';
            tags.forEach(t => t.classList.remove('highlight'));

            // 随机结果（包含自定义食物）
            const resultIndex = Math.floor(Math.random() * allFoods.length);
            const result = allFoods[resultIndex];
            
            // 生成滚动项
            const spins = 25;
            let items = [];
            for (let i = 0; i < spins; i++) {
                const food = allFoods[i % allFoods.length];
                items.push(`<div class="slot-item"><span class="slot-emoji">${getEmoji(food)}</span><span class="slot-text">${food}</span></div>`);
            }
            items.push(`<div class="slot-item"><span class="slot-emoji">${getEmoji(result)}</span><span class="slot-text">${result}</span></div>`);
            
            slotItems.innerHTML = items.join('');
            slotItems.style.transition = 'none';
            slotItems.style.transform = 'translateY(0)';
            
            requestAnimationFrame(() => {
                slotItems.style.transition = 'transform 3s cubic-bezier(0.15, 0.85, 0.3, 1)';
                slotItems.style.transform = `translateY(-${spins * 72}px)`;
            });
            
            setTimeout(() => {
                showConfetti();
                tags[resultIndex].classList.add('highlight');
                btn.disabled = false;
                btn.textContent = '再抽一次';
                isSpinning = false;
                // 显示健康信息
                showHealthInfo(result);
            }, 3000);
        }

        // 重新开始
        function restart() {
            answers = { gender: '', personality: '', mood: '', body: '', extra: '' };
            recommendations = [];
            customFoods = [];
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('extraInput').value = '';
            document.getElementById('customFoodInput').value = '';
            document.getElementById('nextBtn0').disabled = true;
            document.getElementById('nextBtnP').disabled = true;
            document.getElementById('nextBtn1').disabled = true;
            document.getElementById('nextBtn2').disabled = true;
            hideHealthInfo();
            nextPage(1);
            updateSteps(1);
        }

        // 设置
        function openSettings() {
            document.getElementById('apiKeyInput').value = config.apiKey;
            document.getElementById('apiBaseInput').value = config.apiBase;
            document.getElementById('settingsModal').classList.add('show');
        }

        function closeSettings() {
            document.getElementById('settingsModal').classList.remove('show');
        }

        function saveSettings() {
            config.apiKey = document.getElementById('apiKeyInput').value.trim();
            config.apiBase = document.getElementById('apiBaseInput').value.trim() || 'https://api.deepseek.com';
            localStorage.setItem('wte-config', JSON.stringify(config));
            closeSettings();
        }

        function loadConfig() {
            const saved = localStorage.getItem('wte-config');
            if (saved) {
                config = JSON.parse(saved);
            }
        }

        // 彩带
        function showConfetti() {
            const container = document.getElementById('confetti');
            const colors = ['#ff6f56', '#ff9a56', '#ffd56b', '#56c8ff', '#56ff9a'];
            
            for (let i = 0; i < 40; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(piece);
                setTimeout(() => piece.remove(), 4000);
            }
        }

        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) closeSettings();
        });

        // 回车键添加自定义食物
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.id === 'customFoodInput') {
                addCustomFood();
            }
        });

        init();
