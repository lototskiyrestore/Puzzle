
$(function(){
   let numbers = [];
   const result = {
      drop_1: null,
      drop_2: null,
      drop_3: null,
      drop_4: null,
      drop_5: null,
      drop_6: null,
      drop_7: null,
      drop_8: null,
      drop_9: null,
      drop_10: null,
      drop_11: null,
      drop_12: null,
      drop_13: null,
      drop_14: null,
      drop_15: null,
      drop_16: null,
   };

   let number = 1;
   let time = number * 60;
   let intervalId;
   let timerRunning = false;

   //обновление таймера
   function updateTimer() {
      let mins = Math.floor(time / 60);
      let secs = time % 60;
         
      if (mins < 10) mins = `0` + mins;
      if (secs < 10) secs = `0` + secs;
      
      $(`.time`).text(`${mins}:${secs}`);

      $(`.start`).attr(`disabled`, true).css({
         backgroundColor: `rgb(241, 109, 109)`,
      });
            
      if (mins === `00` && secs === `00`) {
         clearInterval(intervalId);
         $(`.time`).text();
         $(`.modal`).css({
            display: `flex`,
            zIndex: `100`
         });
         $(`.check-result`).attr(`disabled`, true).css({
             backgroundColor: `rgb(241, 109, 109)`,
         });
         $('.text').text(`It's a pity, but you lost`);
   
         $('.check').css({
               display: `none`,
         });      
      }
      time--;
   }

   //запуск таймера
   function start(){
      if (!timerRunning) {
         updateTimer();
         intervalId = setInterval(updateTimer, 1000);
         timerRunning = true;
         $(`.check-result`).attr(`disabled`, false).css({
            backgroundColor: `rgb(247, 40, 40)`,
         });
         $('.check').css({
            display: `inline-block`,
         });
      }
   }

   //сброс таймера
   function reset(){    
      time = number * 60;
      mins = Math.floor(time / 60);
      secs = time % 60;
      timerRunning = false;

      if (mins < 10) mins = `0` + mins;
      if (secs < 10) secs = `0` + secs;
      
      $(`.time`).text(`${mins}:${secs}`);
      
      $(`.start`).attr(`disabled`, false).css({
         backgroundColor: `rgb(247, 40, 40)`,
      });

      $(`.drop`).each(function(index, elem) {
         result[$(`.drop`).attr('id')] = null
      });

      $(`.check-result`).attr(`disabled`, true).css({
         backgroundColor: `rgb(241, 109, 109)`,
      });  
   }

   //проверка пазла
   function checkPuzzle() {
      const expected = [
         'piece_1', 'piece_2', 'piece_3', 'piece_4',
         'piece_5', 'piece_6', 'piece_7', 'piece_8',
         'piece_9', 'piece_10', 'piece_11', 'piece_12',
         'piece_13', 'piece_14', 'piece_15', 'piece_16'
      ];

      let isCorrect = true;
   
      for (const [key, value] of Object.entries(result)) {
         const index = parseInt(key.replace('drop_', '')) - 1;
         const expectedValue = expected[index];
   
         if (value !== expectedValue) {
            isCorrect = false;
          
         }
      }
   
      if (isCorrect) {
         clearInterval(intervalId);

         $('.text').text(`Woohoo, well done, you did it!`);

         $('.check').css({
            display: `none`,
         });

         $(`.check-result`).attr(`disabled`, true).css({
            backgroundColor: `rgb(241, 109, 109)`,
         });

         $(`.start`).attr(`disabled`, true).css({
            backgroundColor: `rgb(241, 109, 109)`,
         });
      } 

      else {
         clearInterval(intervalId);

         $('.text').text(`It's a pity, but you lost`);

         $('.check').css({
            display: `none`,
         });

         $(`.check-result`).attr(`disabled`, true).css({
            backgroundColor: `rgb(241, 109, 109)`,
         });

         $(`.start`).attr(`disabled`, true).css({
            backgroundColor: `rgb(241, 109, 109)`,
         });
      }
   }

   // кнопка Сheck result не активна
   $(`.check-result`).attr(`disabled`, true).css({
      backgroundColor: `rgb(241, 109, 109)`,
   });
  
   // пушим индексы $(`.piece`) в массив
   $(`.piece`).each(function(index, elem) {
      numbers.push(index + 1);
   });

   // перемешиваем пазлы(index) в случайном порядке при загрузке страницы
   numbers.sort( function() {
      return Math.random() - .5;
   });
  
   //добавляем доп класс для $(`.piece`)
   $(`.piece`).each(function(index, elem){
      $(elem).addClass(`piece_`+ numbers[index]);
      $(elem).prop(`id`, `piece_` + numbers[index]);
   });

   //добавляем доп класс для $(`.drop`)
   $(`.drop`).each(function(index, elem){
      $(elem).addClass(`drop_`+ (index + 1));
      $(elem).attr('id', `drop_`+ (index + 1));
   });

   //при клике на $(`.start`) запускаем таймер
   $(`.start`).on({
      click: function(){
         start()
      }
   });
   
   //вызов модалки при клике на $('.check-result')
   $('.check-result').on({
      click: function(){
         $(`.modal`).css({
            display: `flex`,
            zIndex: `100`
         });

         $('.text').text(`You still have time, you sure? `);

         $('.time').clone().css({
            color: `rgb(0, 0, 0)`,
            fontSize: `24px`,
            fontWeight: `600`,
            fontFamily: `Verdana, Geneva, Tahoma, sansSerif`,
            textShadow: `none`,
         }).appendTo($('.text'));
      }
   });

   //закрытие модалки при клике на $('.close')  
   $('.close').on({
      click: function(){
         $(`.modal`).css({
            display: `none`,
         });  
      }
   });

   //проверка при клике на $('.check'), правильно ли собран пазл 
   $('.check').on({
      click: function(){
         checkPuzzle(); 
      }
   });

   //сброс таймера при нажатии на $(`.reset`)
   $(`.reset`).on({
      click: function(){
         numbers.sort( function() {
            return Math.random() - .5;
         });

         $(`.piece`).css({
            top: 0,
            left:0,
         });

         $(`.piece`).each(function(index, elem){
            $(elem).prop(`class`, `piece piece_`+ numbers[index])
            $(elem).prop(`id`, `piece_` + numbers[index]);
         })
         clearInterval(intervalId);
         reset()
      },
   });

   $(`.piece`).draggable({
      containment: `.game`,
      stack: 'piece',
      opacity: `.9`,
      zIndex: 100,
      revert: true,
      start: function() {
         start()
      },
      snap: '.drop',
      snapMode: 'inner',
   });
   
   $(`.drop`).droppable({
      accept: $(`.piece`),
      activeClass: `active`,
      hoverClass: `hover`,
      tolerance: `intersect`,
      drop: function(ev, ui) {
         const draggableElem = $(ui.draggable);
         let droppedOn = $(this);
         droppedOn.addClass(`puzzle-present`);
         $(draggableElem).addClass(`dropped-puzzle`)
         $(draggableElem).css({
            top: 0,
            left: 0,
            position: `relative`,
            width: `100%`,
            height: `100%`,
         }).appendTo(droppedOn)

         result[$(this).attr('id')] = draggableElem.attr('id');
         console.log(result)
      
         $(ui.draggable).draggable('option', 'revert', false);

         // setTimeout(() => {
         //    $(ui.draggable).draggable('option', 'revert', true);
         // }, 200)
      },
   });  
});
