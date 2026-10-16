# 도안 제작 규칙

현재 카테고리: 상상.

선택 목록은 페이지 내 메모리에서만 유지한다. 카테고리 이동 시 유지하되 새로고침·재접속·브라우저 뒤로가기 복원 시 초기화한다. localStorage 등에 선택을 저장하지 않는다.

상상은 미완성 그림 이어 그리기와 닫힌 기본 도형 변형 활동이다. 기존 단일 완성 대상용 이미지 프롬프트·닫힌 영역 규칙은 이 카테고리에 일괄 적용하지 않는다. 흰 배경에 열린 선·점·도형 일부 또는 닫힌 기본 도형 하나를 두고 넉넉한 여백을 남긴다. 정답을 암시하는 이름이나 안내문을 도안에 출력하지 않는다. 단순한 기하 도안은 선명하고 가벼운 네이티브 SVG로 제작한다.

상상 01~10(새로 앞에 추가한 닫힌 기본 도형): 01 원, 02 타원, 03 삼각형, 04 정사각형, 05 직사각형, 06 오각형, 07 육각형, 08 마름모, 09 별, 10 하트. 식별자는 imagination-basic-*를 사용한다.

상상 11~20(기존 01~10): 11 반쪽 하트, 12 열린 원호, 13 세 점, 14 물결선, 15 떨어진 곡선 두 개, 16 꺾인 선, 17 둥근 모서리, 18 열린 소용돌이, 19 길이가 다른 두 선, 20 끊어진 삼각형. 그림과 기존 식별자는 유지하고 표시 이름만 10씩 올렸다.

상상 21~30(기존 11~20): 21 떨어진 긴 곡선, 22 마주 보는 두 모서리, 23 흩어진 가로선 세 개, 24 열린 물방울 형태, 25 양 끝이 열린 넓은 곡선, 26 흩어진 네 점, 27 계단선, 28 곡선과 먼 점, 29 방향이 다른 두 꺾임, 30 갈고리 곡선과 먼 짧은 선. 상상은 총 30개, 전체 도안은 80개다. 다음 추가 도안의 표시 번호는 31부터 시작하고, 기존 식별자와 겹치지 않는 고유 id를 사용한다. 카테고리별 50개 상한에는 닫힌 기본 도형도 포함한다.

여러 선이나 조각이 분리된 상상 도안은 각 부분 사이에 넉넉한 공간을 둔다. 13·15·19·20은 학생이 사이를 이어 그릴 수 있도록 간격을 넓혔다. 조각들이 거의 붙어 이미 완성된 도형처럼 보이지 않게 한다.

카테고리 순서: 상상, 동물, 음식, 과일·채소, 탈것, 바다, 공룡, 자연, 우리 집, 놀이·운동, 우주. 상상을 첫 화면으로 연다. 곤충·직업은 사용자 요청으로 삭제했다.

추가 스타일 조정: 실제 구조는 지키되 지나치게 실사나 도감처럼 그리지 않는다. 기존 도안과 어울리는 귀엽고 통통한 형태, 부드러운 곡선, 단순한 큰 구조를 유지한다. 해부학적 제약 때문에 그림체가 지나치게 사실적으로 바뀌지 않도록 균형을 맞춘다.

최신 사용자 수정사항: 동물도 실제 생김새와 신체 구조를 따른다. 사람 같은 웃는 입·눈썹·혀·치아 등 없는 특징을 추가하지 않는다. 문어의 입은 팔 아래에 있으므로 얼굴에 그리지 않고, 거북이는 실제 닫힌 부리 형태로 그린다. 고정 템플릿 원문은 유지하되 이 최신 해부학적 제약을 생성 지시 뒤에 추가해 우선 적용한다.

동물 완료 대상: 고양이(cat), 토끼(rabbit), 강아지(puppy), 코끼리(elephant), 곰(bear).

음식 완료 대상: 도넛(donut), 컵케이크(cupcake), 햄버거(hamburger), 피자 한 조각(slice of pizza), 아이스크림(ice cream cone).

과일·채소 완료 대상: 사과(apple), 배(pear), 딸기(strawberry), 당근(carrot), 브로콜리(broccoli).

탈것 완료 대상: 자동차(car), 버스(bus), 기차(train locomotive), 비행기(airplane), 배(boat).

바다 완료 대상: 고래(whale), 돌고래(dolphin), 문어(octopus), 바다거북(sea turtle), 불가사리(starfish). 문어·바다거북·돌고래·고래는 최신 사용자 수정사항을 반영하여 재생성한 버전을 사용한다.

공룡 완료 대상: 티라노사우루스(Tyrannosaurus rex), 트리케라톱스(Triceratops), 브라키오사우루스(Brachiosaurus), 스테고사우루스(Stegosaurus), 안킬로사우루스(Ankylosaurus).

자연 완료 대상: 해바라기(sunflower), 튤립(tulip), 참나무(oak tree), 소나무(pine tree), 버섯(mushroom).

우리 집 완료 대상: 의자(wooden dining chair), 소파(two-seater sofa), 침대(bed), 옷장(wardrobe), 탁상등(table lamp). 최초 chair/sofa 결과는 지나치게 유사해 제외하고 구분이 분명한 대상을 재생성했다.

놀이·운동 완료 대상: 축구공(soccer ball), 농구공(basketball), 야구 글러브(baseball glove), 테니스 라켓(tennis racket), 스케이트보드(skateboard).

우주 완료 대상: 로켓(space rocket), 우주비행사(astronaut), 인공위성(artificial satellite), 달 탐사차(lunar rover), 토성(planet Saturn).

도안은 2개씩 생성해 앱에 바로 추가한다. 다운로드용 압축파일은 카테고리가 완성되거나 사용자가 요청할 때만 갱신한다.

이미지 도안을 추가할 때마다 원본은 images/에 보존하고, 최대 480px WebP 미리보기를 thumbnails/에 생성한다. drawings.js에는 image와 thumbnail 경로를 함께 기록한다. 화면은 thumbnail을 지연 로딩하고 인쇄는 원본 image를 사용한다. 상상 SVG에는 별도 미리보기 파일이 필요 없다.

사용자가 다음 그려줘라고 하면 현재 카테고리에 중복되지 않는 대상 2개를 생성해 추가한다. 사용자가 카테고리를 바꾸면 그 카테고리에 2개씩 추가한다. 사용자 검토 전에 추가 배치를 진행하지 않는다. 사이트의 이름은 한국어로 표기한다.

생성 방식: 내장 image_gen 도구로 각 이미지마다 아래 템플릿의 [SUBJECT] 두 곳을 대상 영문명으로만 교체한다. 그 외 문구를 수정하거나 추가하지 않는다. 흰 배경, 단일 대상, 넓은 색칠 영역과 닫힌 외곽선을 검토한다. 무생물에는 얼굴을 추가하지 않는다.

## 고정 템플릿

A high-quality, charming children's coloring page featuring ONLY one single, playful [SUBJECT] centered on a pure white background. Strictly NO background, NO clouds, NO borders, NO ground, NO text, and NO other environmental elements. The style is 'Bold and Easy' for kids, showing a stout, plump, and chunky single [SUBJECT] designed with friendly, rounded curves and natural dimensions that give it a rich, voluminous feel (not flat, rigid, or like a generic icon). Show the object at a dynamic, natural angle (like a 3/4 view) to capture its playful form, with 3 to 5 clear, large internal details to make it look complete and engaging (e.g., windows, wings, wheels, seeds, or natural structural patterns), while keeping coloring areas wide and easy. Very thick, smooth, and uniform black vector line art on a pure white background, with no tiny patterns, no complex details, and no tiny features. Strictly NO shading, NO grayscale, and NO extra details. (Note: If the subject is an inanimate object like food, fruit, vehicle, or household item, strictly DO NOT add cartoon eyes or faces to it.)

매 업데이트 후 업로드 전에 node scripts/version-assets.mjs를 실행하여 index.html의 내부 파일 버전을 갱신한다. 사이트 기본 URL은 바꾸지 않는다.
