# Backlog — Tự Học Đàn Organ

Kế hoạch mở rộng app từ "đọc nốt" thành giáo trình organ vỡ lòng hoàn chỉnh.
Triển khai dần, mỗi mục là một lần commit độc lập.

Trang chạy tại https://thawngscof.github.io/tuhocdan/

---

## Trạng thái hiện tại

Đã có:

- Bàn phím C2–C6 (49 phím) tương tác, phát tiếng bằng Web Audio
- Khuông nhạc khóa Sol + khóa Fa, đủ 49 nốt mỗi khóa kể cả nốt thăng
- Dòng kẻ phụ vẽ đúng, viewBox tự co giãn theo nốt
- Tab mẹo đọc nhanh (nốt cột mốc, F-A-C-E, dòng/khe)
- Game phản xạ nhận diện nốt, 3 phạm vi (cơ bản / toàn bộ / nốt thăng)

Mảng **trường độ** — vốn là chỗ trống lớn nhất khi viết backlog này — nay đã xong cả:

| Khái niệm | Trạng thái |
|---|---|
| Hình nốt (tròn, trắng, đen, móc đơn) | ✅ T1 |
| Dấu lặng | ✅ T2 |
| Số chỉ nhịp, vạch nhịp, ô nhịp | ✅ T3 |
| Tiết tấu, máy gõ nhịp | ✅ T5 + T6 |
| Hợp âm tay trái | ✅ T8 |
| Gam, ngón bấm | ✅ T4 + T9 |
| Bài hát tập chơi | ✅ T10 (4 bài — xem phần còn thiếu ở T10) |
| Lộ trình bài học có thứ tự | ✅ T11 |
| Nốt chấm dôi, dấu nối | ✅ T15 |
| Dấu giáng, hoá biểu | ✅ T14 |
| Quãng, luyện tai | ✅ T12 + T13 |
| Chơi bằng bàn phím máy tính, nhãn ARIA | ✅ T16 |
| Dùng được trên điện thoại | ✅ T17 |

**Toàn bộ T1–T21 đã xong**, và âm thanh đã được nghe thử trên trình duyệt (2026-09-16) — rủi ro treo lâu nhất của dự án đã dứt. Còn lại ghi ở mục "Việc chưa kiểm chứng" cuối file.

## Chạy kiểm thử

```
node tools/verify.js        # nhanh — chạy sau mỗi lần sửa
node tools/break/all.js     # chậm — chạy sau khi xong một tính năng
```

Chỉ cần Node, không cài gì thêm.

`verify.js` là bộ kiểm tra. `tools/break/` cố tình làm hỏng code theo 269 cách và đòi bộ kiểm tra **phải bắt được từng cái** — một phép kiểm tra sống sót qua chính phép phá dành cho nó thì không kiểm tra điều gì cả. Nó chạy lại toàn bộ bộ kiểm tra cho mỗi mutation nên chậm hơn nhiều.

## Nguyên tắc kỹ thuật

- Không build step — deploy thẳng lên GitHub Pages. (Nguyên tắc cũ là "một file `index.html` tự chứa"; T19 tách thành `index.html` + `styles.css` + `app.js` khi vượt ngưỡng 150KB mà chính nó đặt ra. Phần "không build step" giữ nguyên.)
- Phụ thuộc ngoài chỉ có Tailwind CDN + Inter font, không thêm thư viện nhạc
- Toàn bộ nội dung tiếng Việt, thuật ngữ nhạc lý theo cách gọi phổ thông ở VN
- Mỗi thay đổi renderer phải verify headless được (xem `T20`)

---

## Giai đoạn 1 — Nền tảng renderer

Mọi thứ về tiết tấu đều chặn ở đây. Làm trước.

### T1 · Vẽ được hình nốt theo trường độ — ✅ XONG
Bảng `DURATIONS` ở cấp module: `w` tròn (4 phách), `h` trắng (2), `q` đen (1), `e` móc đơn (½). Mỗi mục khai báo `beats`, `hollow`, `stem`, `flags` — T3 sẽ dùng lại `beats` để chia ô nhịp.

Tham số `item.dur`, mặc định `q` nên 98 lời gọi cũ không đổi một pixel (có test khẳng định điều này). Trường độ lạ thì log lỗi rồi vẽ nốt đen, không im lặng.

Thêm 15 phép kiểm tra vào `tools/verify.js`, kiểm chứng bằng 12 phép phá có chủ đích.

### T2 · Dấu lặng — ✅ XONG
Tham số `item.rest`: mang trường độ nhưng không mang cao độ, nên bỏ qua hẳn khâu tra `notesData`. Dùng lại bảng `DURATIONS`, thêm trường `restName` để mỗi trường độ tự gọi được tên dấu lặng tiếng Việt.

Vị trí theo quy ước khắc nhạc: lặng tròn **treo dưới dòng 4**, lặng trắng **nằm trên dòng 3** — hai nửa đối nhau của cùng một khe, đó là dấu hiệu duy nhất phân biệt chúng nên phép kiểm tra chốt đúng toạ độ. Lặng đen và lặng móc đơn vắt qua dòng giữa.

Dấu lặng chiếm một ô trong hàng như nốt nhạc, không bị lọc bỏ. Trường độ lạ thì log lỗi rồi vẽ lặng đen.

Thêm 13 phép kiểm tra, kiểm chứng bằng 9 phép phá có chủ đích — bắt được cả 9. Phép "vắt qua dòng giữa" lúc đầu **lọt lưới một mutation**: nó đo cả ký hiệu khóa Sol, mà glyph đó tự nó đã vắt qua dòng giữa nên luôn đúng bất kể vẽ dấu lặng ở đâu; đã sửa thành tách riêng ink của dấu lặng bằng cách so với khuông rỗng.

Nâng `verticalExtent` trong `verify.js`: trước chỉ đọc thuộc tính `y`, giờ hiểu `rect` (cả chiều cao), bán kính `circle`/`ellipse`, lệnh `L`/`H`/`V` trong path, và dịch chuyển của `<g transform="translate">`. Đã kiểm chứng là cần thiết: một `rect` tràn đáy viewBox **chỉ bằng chiều cao** thì bản cũ bỏ lọt, bản mới bắt được.
- **Phụ thuộc:** T1

### T3 · Số chỉ nhịp, vạch nhịp, ô nhịp — ✅ XONG
Tham số thứ sáu `timeSig`, dạng chuỗi `"3/4"`. Sức chứa ô nhịp quy về đơn vị nốt đen (`tử × 4 / mẫu`) để dùng chung `DURATIONS.beats` — nhờ vậy 6/8 chứa 3 phách đen chứ không phải 6, và 2/2 chứa 4.

Đổ đầy từng ô nhịp rồi mới sang ô kế; vạch nhịp vẽ ở **chính giữa hai nốt** mà nó ngăn cách. Kết bằng vạch đôi mảnh–đậm. Số chỉ nhịp xếp chồng sau khóa nhạc: tử giữa dòng 3–5, mẫu giữa dòng 1–3.

Ô nhịp thừa hoặc thiếu phách thì `console.warn` nêu rõ ô số mấy, đang có bao nhiêu phách, nhịp cần bao nhiêu — dùng `warn` chứ không `error` để không lẫn với quy ước "từ chối vẽ" đã có. Số chỉ nhịp không đọc được thì `console.error` rồi vẽ khuông trơn, không đoán bừa thành 4/4.

**Không truyền `timeSig` thì không một pixel nào đổi** — `startX` chỉ nới rộng khi thật sự có nhịp. Có phép kiểm tra chốt riêng điều này: lúc đầu nó thiếu, và một mutation dời `startX` cho *mọi* khuông đã lọt lưới dù làm cả 98 render cũ dịch ngang.

Thêm 33 phép kiểm tra, kiểm chứng bằng 13 phép phá có chủ đích — bắt được cả 13. Ranh giới ô nhịp đối chiếu bằng **kỳ vọng viết tay** chứ không cài lại vòng lặp chia ô nhịp trong test: viết lại thuật toán thì hai bên sẽ cùng sai một kiểu.
- **Phụ thuộc:** T1, T2

### T4 · Số ngón tay — ✅ XONG
Tham số `item.finger` (1–5). Chỉ nhận số nguyên 1–5; ngoài khoảng đó, hoặc chuỗi `"3"`, hoặc đặt lên dấu lặng, thì `console.error` rồi bỏ qua.

Số ngón in thành **một hàng phía trên khuông** như sách dạy đàn, chỉ dâng cao hơn với nốt vốn đã nằm trên hàng đó. Ban đầu tôi cho số bám sát từng nốt — test bắt ngay: nốt C2 khóa Sol có tới 8 dòng kẻ phụ, số ngón rơi đúng vào giữa đám dòng đó.

Trên phím đàn: `setKeyFingering({ "c/4": 1 })` và `clearKeyFingering()`. Map được lưu rồi **vẽ lại bàn phím từ nó**, chứ không chọc badge vào DOM sau — markup chỉ có một nguồn. Phím lạ hoặc số lạ đều bị từ chối.

Nhãn `item.label` và số ngón dùng chung một cột, nên nhãn tự dâng lên khi nốt có cả hai.

Thêm 27 phép kiểm tra, kiểm chứng bằng 16 phép phá có chủ đích. **Ba phép lọt lưới ở lần chạy đầu**, mỗi phép lộ một vấn đề khác nhau:
- Nhánh "tránh đuôi nốt hướng lên" hoá ra là **code chết** — nốt có đuôi hướng lên luôn nằm dưới hàng số ngón nên số hạng đó không bao giờ thắng. Đã xoá thay vì viết test cho nó.
- `verticalExtent` coi `<text>` là một điểm, quên rằng chữ vươn lên trên đường cơ sở. Nay tính thêm phần thân chữ theo `font-size`.
- Regex đọc badge chỉ bắt chữ số, nên badge `undefined` bị đọc thành "không có badge". Đã nới thành bắt mọi nội dung.
- **Phụ thuộc:** T1

## Giai đoạn 2 — Động cơ phát nhạc

### T5 · Máy gõ nhịp — ✅ XONG
Kiểu scheduler nhìn trước kinh điển của Web Audio: một `setInterval` 25ms chỉ để **thức dậy**, còn mọi thời điểm gõ đều tính theo `AudioContext.currentTime` và lập lịch trước 0.12s. `setInterval` trôi, đồng hồ audio thì không.

40–208 BPM (ngoài khoảng thì từ chối), 2–12 phách/ô nhịp. Phách đầu ô nhịp gõ **cao hơn và to hơn** (1600Hz/0.26 so với 1000Hz/0.15) — cả hai khác biệt đều có test riêng, vì chỉ đổi một trong hai là mất tác dụng nhấn. Tiếng gõ đi qua đúng chuỗi limiter của T7.

Đèn phách: hàng chấm tròn, chấm đầu to hơn. `metronomeBeatAt(now)` **rút cạn** hàng đợi tới thời điểm hiện tại rồi trả về phách gần nhất, nên một khung hình đến muộn sẽ nháy đúng phách hiện tại chứ không phát lại cả chuỗi phách đã lỡ.

Giao diện: thẻ "Máy Gõ Nhịp" trong tab Luyện Tập — nút bắt đầu/dừng, thanh trượt tốc độ, chọn số phách/ô nhịp.

Thêm 43 phép kiểm tra, kiểm chứng bằng 20 phép phá — bắt được cả 20. **Ba phép lúc đầu không bị bắt đúng nghĩa:** hai phép làm rò `setInterval` chỉ khiến tiến trình treo (bộ test không phát hiện, nó chỉ chết), và phép "scheduler chạy tiếp sau khi dừng" lọt hẳn vì lúc kiểm tra thì chưa có phách nào tới hạn. Nay `verify.js` đếm timer đang mở (và `unref` chúng), còn phép kiểm tra cho đồng hồ chạy vượt qua phách đang chờ trước khi đo.

### T6 · Phát chuỗi nốt theo trường độ — ✅ XONG
`sequenceSchedule(items, bpm, startAt)` tách riêng thành **hàm thuần** — không audio, không DOM. Tiết tấu là phần đáng kiểm tra nhất, và chỉ kiểm tra được khi nó đứng một mình. Dấu lặng chiếm thời gian như mọi mục khác; thiếu `dur` thì là nốt đen, đúng như mọi nơi.

`playSequence(items, { clef, bpm, loop, from, to })` — `from`/`to` cho phép **lặp từng câu**. 30–200 BPM. Nốt giữ 92% ô của nó rồi mới nhả, nên hai nốt trùng cao độ liền nhau vẫn nghe tách bạch (có test đo: điểm nhả phải đến trước lúc nốt kế bắt đầu).

`pauseSequence()` **phải tắt tiếng những nốt đã lập lịch** — chúng đang nằm ở tương lai của đồng hồ audio và sẽ kêu bất kể giao diện nghĩ gì. Nhớ vị trí đang tới, `resumeSequence()` phát tiếp từ đó.

Nốt không có trong khóa đang dùng: báo lỗi, để im lặng, **vẫn giữ nguyên thời lượng** — đoạn nhạc không co lại. Im lặng thì nghe ra, nốt sai thì không.

Giao diện: thẻ "Nghe Một Câu Nhạc" — hai ô nhịp 4/4 dùng đủ nốt đen, móc đơn, trắng, dấu lặng và số ngón. **Đây là chỗ đầu tiên T1–T4 thật sự hiện ra trên trang** (trước đó chỉ tồn tại trong test).

Thêm 45 phép kiểm tra, kiểm chứng bằng 19 phép phá — bắt được cả 19. Một phép lọt: chốt chặn "đoạn rỗng" hoá ra **không gánh việc đúng đắn** (chốt kiểm tra phạm vi câu bắt luôn rồi), nó chỉ tồn tại để cho thông báo dễ hiểu — nên phép kiểm tra nay kiểm đúng câu chữ đó.
- **Phụ thuộc:** T5

### T7 · Nâng chất lượng âm thanh — ✅ XONG
Làm **trước T5/T6**: cả máy gõ nhịp lẫn bộ phát đều dựng trên động cơ này, sửa sau sẽ phải làm lại.

Mọi thứ phát ra tiếng đều đi qua đúng một chuỗi: `oscillator → gain ADSR riêng từng nốt → limiter → master gain → loa`. **Không gì nối thẳng vào `ctx.destination`** — đó chính là thứ giữ cho hợp âm không cộng biên độ vượt mức. Đỉnh mỗi nốt hạ từ `0.3` xuống `0.22`, nên bốn nốt cùng lúc vẫn nằm trong khoảng.

`playTone(freq, opts)` nhận thêm `at` (thời điểm phát, tính theo giờ của AudioContext — T6 cần), `hold`, và `voice`. Có `voice` thì bấm lại cùng phím sẽ **tắt dần** nốt cũ trong 30ms rồi mới đánh nốt mới, thay vì chồng lên nhau; tắt phụt sẽ nghe "cạch".

Thêm 27 phép kiểm tra, dựng một `AudioContext` giả ghi lại mọi lời gọi lập lịch, kiểm chứng bằng 16 phép phá — bắt được cả 16.

> **Giới hạn:** bộ kiểm tra này chứng minh **hình dạng đồ thị và lịch phát**, không chứng minh có tiếng kêu. Việc "âm thanh chưa test thật trên trình duyệt" ở cuối file vẫn còn nguyên.

## Giai đoạn 3 — Nội dung giảng dạy

### T8 · Hợp âm tay trái — ✅ XONG
Bảy hợp âm viết ở quãng tám 3 (vùng tay trái trên bàn phím này), **chỉ viết thế gốc**; thế đảo suy ra bằng cách nâng nốt thấp nhất lên một quãng tám — một chỗ duy nhất để nốt sai có thể ẩn, thay vì ba.

**Renderer phải mổ để vẽ chồng nốt.** Thêm `item.keys` (mảng) bên cạnh `item.key`: nhiều đầu nốt cùng một cột, **một** đuôi chung, dòng kẻ phụ dùng chung (vẽ hai lần sẽ dày lên), dấu hoá xếp lùi dần sang trái, và hai nốt cách nhau một bậc thì nốt trên **né sang phía kia của đuôi** — trường hợp này có thật ở thế đảo của G7.

Hướng đuôi do **cả chồng nốt** quyết định, không phải nốt thấp nhất. Chiều dài đuôi bằng bề rộng chồng nốt cộng 26.

Chụp ảnh **1486 lượt vẽ** của bản đã commit rồi so lại sau khi mổ: **không đổi một byte**. Đó là cách duy nhất tôi tin được rằng T1–T4 còn nguyên.

Phát kiểu chặn (cùng lúc) và kiểu rải (cách nhau một móc đơn theo tốc độ đang đặt). Hai vòng hợp âm C–G–Am–F và C–Am–F–G, mỗi hợp âm một ô nhịp.

Thêm 43 phép kiểm tra, kiểm chứng bằng 23 phép phá — bắt được cả 23. Hợp âm đối chiếu bằng **quãng suy từ chính tên hợp âm** (đuôi `m` là thứ, đuôi `7` là bảy át, còn lại là trưởng), không so với danh sách nốt đang nuôi trang — so dữ liệu với chính nó thì nốt bậc ba sai vẫn qua. Hai phép lúc đầu lọt lưới, cả hai về đuôi nốt: phép kiểm tra hướng đuôi dùng hợp âm không phân biệt được hai quy tắc (đã đổi sang Dm), và phép kiểm tra độ dài đuôi chỉ đòi "vượt qua đầu kia" nên một đuôi cụt 6px vẫn lọt.
- **Phụ thuộc:** T7

### T9 · Gam Đô trưởng & ngón bấm — ✅ XONG
**Chỉ viết chiều đi lên.** Chiều đi xuống suy ra bằng cách đảo ngược — cùng nốt, cùng ngón — nên hai chiều không bao giờ lệch nhau, và cũng nhờ vậy điểm luồn ngón tự rơi đúng chỗ ở cả hai chiều mà không phải khai báo hai lần.

Tay phải `1 2 3 1 2 3 4 5` (luồn ngón cái ở nốt Fa), tay trái `5 4 3 2 1 3 2 1` (bắc ngón 3 qua ngón cái ở nốt La). Hai tay là **ảnh gương của nhau** — có phép kiểm tra riêng cho điều đó.

Đi lên 8 nốt rồi xuống 7 nốt (không gõ lại nốt đỉnh), nốt cuối ngân 2 phách để trọn 4 ô nhịp 4/4. Khi phát, số ngón hiện luôn lên phím đàn qua `setKeyFingering` của T4.

Thêm 46 phép kiểm tra, kiểm chứng bằng 17 phép phá — bắt được cả 17. Nốt đối chiếu với **mẫu quãng của gam trưởng** (`0 2 4 5 7 9 11 12` nửa cung), còn ngón bấm đối chiếu với **thứ bàn tay làm được**: năm ngón, không ngón nào bấm hai nốt liền nhau, và **đúng một** chỗ đổi thế tay — chỗ đó bắt buộc phải dính tới ngón cái, tức luồn xuống hoặc bắc qua.
- **Phụ thuộc:** T4, T6

### T10 · Bài hát tập chơi — ✅ XONG (4 bài, xem phần còn thiếu)
Bốn bài, mỗi bài ghi rõ `origin` giải thích vì sao thuộc phạm vi công cộng:

| Bài | Nguồn |
|---|---|
| Kìa Con Bướm Vàng | Dân ca Pháp "Frère Jacques" |
| Ánh Sao Nhỏ | Dân ca Pháp "Ah! vous dirai-je, maman" |
| Chú Cừu Nhỏ | Dân gian Anh "Mary Had a Little Lamb" |
| Khúc Hoan Ca | Beethoven, "Ode an die Freude" (1824) |

Tập từng câu: câu suy ra từ ranh giới ô nhịp (2 ô nhịp một câu), bấm là **lặp lại** câu đó. Cả bài chia trọn ô nhịp — có phép kiểm tra riêng, và còn mượn luôn lời cảnh báo của T3 làm nhân chứng thứ hai.

Khúc Hoan Ca **giản lược hai chỗ kết** (đen–đen–trắng thay cho đen chấm dôi–móc đơn–trắng, vì chấm dôi thuộc T15). Chỗ giản lược được ghi vào trường `simplified` và hiện ra trên trang, chứ không lặng lẽ cho qua.

Thêm 48 phép kiểm tra, kiểm chứng bằng 15 phép phá — bắt được cả 15. Giai điệu thì **không phép kiểm tra nào chứng minh được là đúng bài** — chỉ tai người mới biết; những gì kiểm được là phần xung quanh: ô nhịp cộng đủ, mọi nốt bấm được, mỗi bài khai nguồn gốc, các câu phủ kín bài không hở không chồng.

#### Còn thiếu — cần người kiểm nốt
Backlog đặt ra "dân ca / thiếu nhi quen thuộc", mà bốn bài trên **đều là giai điệu châu Âu** (dù "Kìa Con Bướm Vàng" thì trẻ em Việt Nam nào cũng thuộc). Tôi định thêm **Lý Cây Xanh** và **Bắc Kim Thang** — dân ca Nam Bộ, chắc chắn thuộc phạm vi công cộng — nhưng **không đủ chắc về cao độ từng nốt**, mà mã hoá sai giai điệu thì còn tệ hơn là thiếu bài. Cần người biết bài chép lại nốt rồi mới thêm.

Cũng đã cân nhắc và **loại**: "Cháu lên ba" (Phong Nhã, mất 2020 — còn bản quyền), "Con cò bé bé" (không rõ tác giả).
- **Phụ thuộc:** T3, T6

### T11 · Lộ trình bài học — ✅ XONG
Tab "📚 Bài Học" với đúng 10 bài theo thứ tự đã định. Mỗi bài: mục tiêu, ba đoạn lý thuyết, một nút **thực hành dẫn thẳng tới phần tương ứng của trang** (chứ không dựng lại cái đã có), rồi ba câu kiểm tra. Đúng cả ba câu thì bài được đánh dấu xong.

Bài thực hành gọi: `scrollKeyboardTo`, `switchTab`, `setClef`, `startMetronome`, `playScale`, `playProgression`, `setSong`. **Có phép kiểm tra đối chiếu từng lời gọi đó với hàm thật trong trang** — cùng loại bẫy như nút gắn sai tên hàm, và cũng vô hình cho tới khi có người bấm.

Tiến độ lưu `localStorage` dưới khoá `tuhocdan.progress.v1`. **Dữ liệu đọc từ đó bị coi là dữ liệu lạ**, không phải đồ nhà: bản cũ của trang, tab khác, hay người mở dev tools đều có thể đã ghi vào đấy. Nên nó lọc bỏ id bài không tồn tại, khử trùng lặp, và bắt mọi ngoại lệ — riêng chuyện `localStorage` ném lỗi trong chế độ riêng tư là có thật.

Thêm 87 phép kiểm tra, kiểm chứng bằng 19 phép phá — bắt được cả 19. **Ba phép lúc đầu không bị bắt đúng nghĩa:** phép "đánh dấu xong hai lần" lọt vì tôi đọc tiến độ qua chính hàm tải vốn tự khử trùng lặp, nên bản ghi lặp bị giấu (nay kiểm thẳng chuỗi đã lưu); hai phép còn lại chỉ làm script ném lỗi ra ngoài, tức bộ test chết chứ không phải phát hiện (nay bọc lại để báo thành phép kiểm tra có tên).
- **Phụ thuộc:** T1–T10

## Giai đoạn 4 — Mở rộng

### T12 · Luyện tai — ✅ XONG
Hai chế độ: **nghe nốt** rồi gọi tên, và **nghe quãng** rồi gọi tên quãng (dùng lại `intervalBetween` của T13). Bốn lựa chọn, có xáo trộn, một câu chỉ trả lời một lần, có điểm và chuỗi đúng.

Câu hỏi **không vẽ gì lên khuông, không sáng phím nào** — cả điểm của bài là câu trả lời phải đến từ tai; hiện phím ra là lộ đáp án. Có phép kiểm tra riêng cho chuyện đó, và một phép phá cho panel in kèm tên phím ra để chắc rằng phép kiểm tra ấy có hiệu lực.

Thêm 24 phép kiểm tra, kiểm chứng bằng 16 phép phá — bắt được cả 16. Vì câu hỏi sinh **ngẫu nhiên**, phép kiểm tra không chốt một lượt rút cụ thể mà khẳng định thứ phải đúng với *mọi* câu — và rút **200 lượt** mỗi chế độ để một trường hợp hiếm không lẩn được. Trong đó có phép "đáp án đúng phải xuất hiện ở cả bốn vị trí", đủ để bắt việc quên xáo trộn.

### T13 · Quãng — ✅ XONG
Một quãng có hai phần và hai phần đó **đếm theo hai cách khác nhau** — đó chính là chỗ sinh ra lỗi:
- **Số quãng** đếm tên nốt, tính cả hai đầu, và **không đếm xỉa gì tới dấu thăng**. Đô lên Mi là quãng 3 vì Đô–Rê–Mi là ba tên nốt.
- **Tính chất** (trưởng / thứ / đúng / tăng / giảm) suy từ số nửa cung.

Cả hai đều suy từ tên nốt, nên chúng buộc phải khớp với nhau. Hệ quả có thật: **Đô lên Rê♯ là quãng 2 tăng, không phải quãng 3 thứ** — tôi viết test sai chỗ này và test đã bắt lại; ghi thành Mi♭ thì mới là quãng 3, mà dấu giáng thuộc T14.

Vẽ bằng `item.keys` của T8 (hai đầu nốt một cột, một đuôi chung). Phát hai nốt cùng lúc rồi lần lượt — hoà trước, khoảng cách sau. Đưa cho hai nốt ngược thứ tự cũng ra cùng kết quả; cùng một nốt thì nói rõ là không phải quãng; rộng quá quãng tám thì nói rộng quá, chứ không đặt bừa một cái tên.

Thêm 34 phép kiểm tra, kiểm chứng bằng 14 phép phá — bắt được cả 14. Phép kiểm tra đối chiếu bằng **khoảng cách tên nốt tự tính trong test**, không đọc bảng của trang.

### T14 · Dấu giáng và hóa biểu — ✅ XONG

#### Quyết định về ghi trùng âm (C♯ / D♭)
**Phím là một chuyện, cách ghi là chuyện khác.** Bàn phím giữ nguyên một tên duy nhất theo lối thăng — một phím, một id, không nhân đôi dữ liệu — còn `item.spell: 'flat'` bảo khuông nhạc ghi đúng phím ấy theo lối kia.

Nốt ghi giáng nằm ở **tên nốt phía trên**: Đô♯ trên dòng của Đô, Rê♭ ở chỗ của Rê. **Cùng tiếng, khác chỗ** — mà đó chính là thứ người mới học cần nhìn thấy. Đã dựng riêng một thẻ trong tab mẹo đọc để bày hai cách ghi cạnh nhau.

Phương án bị loại: thêm hẳn các nốt ghi giáng vào `keyboardKeys`. Làm vậy thì một phím đàn có hai id, và mọi thứ tra cứu theo `key` (sáng phím, hợp âm, bài hát, số ngón) đều phải biết hai id đó là một.

#### Hoá biểu
`keySig` là tham số thứ bảy của `renderScoreSVG`. Thứ tự dấu hoá là **toàn bộ quy ước**, nên chỉ ghi một lần: thăng theo Fa–Đô–Sol–Rê–La–Mi–Si, giáng theo Si–Mi–La–Rê–Sol–Đô–Fa; số lượng dấu quyết định lấy mấy cái đầu. Vị trí ghi theo khoá Sol, khoá Fa hạ xuống hai bậc. Có sẵn C, G, D, A, F, B♭, E♭.

Hoá biểu **tự chừa chỗ cho mình**: nốt và số chỉ nhịp đều dịch sang phải theo bề rộng của nó.

Thêm 62 phép kiểm tra, kiểm chứng bằng 18 phép phá — bắt được cả 18. Một phép lọt lúc đầu: **không có phép nào kiểm ký hiệu hoá biểu là thăng hay giáng**, chỉ kiểm thứ tự tên nốt — nên một hoá biểu giáng viết toàn dấu thăng vẫn qua.

### T15 · Nốt chấm dôi và dấu nối — ✅ XONG
`item.dot` và `item.tie`.

**Gom một chỗ duy nhất biết một nốt đáng bao nhiêu phách:** `itemBeats(item)`. Trước đó ba nơi tự tính riêng (chia ô nhịp, lập lịch phát, bảng bài hát), tức chấm dôi có thể đáng một giá trị khi chia ô nhịp và một giá trị khác khi phát ra tiếng. Có hai phép phá riêng cho đúng kiểu lệch đó.

Chấm dôi vẽ bên phải đầu nốt; nốt nằm **trên dòng kẻ** thì chấm nhích lên khe phía trên — chỗ người khắc nhạc vẫn đặt.

Dấu nối chỉ nối **hai nốt cùng cao độ**; nối hai cao độ khác nhau là dấu luyến, nghĩa hoàn toàn khác, nên bị từ chối. Khi phát, chuỗi nốt nối **gõ một lần** rồi ngân trọn cả chuỗi — dài bao nhiêu nốt cũng vậy.

**Khúc Hoan Ca nay ghi đúng tiết tấu Beethoven viết** (đen chấm dôi – móc đơn – trắng); trường `simplified` đã gỡ bỏ.

Thêm 34 phép kiểm tra, kiểm chứng bằng 19 phép phá — bắt được cả 19. **Bốn phép lúc đầu lọt lưới**, và hai trong số đó chỉ ra vấn đề thật:
- Dây nối **từ ba nốt trở lên** gộp sai — nốt thứ ba vẫn bị gõ lại giữa lúc đang ngân. Đã sửa thành gộp theo chuỗi.
- `Math.max` khi tính điểm kết đoạn là thừa: dấu nối nuốt đúng độ dài nốt sau nên kết thúc đúng chỗ nốt đó lẽ ra kết thúc, không bao giờ xa hơn. Đã rút gọn và ghi lý do vào comment.
- Một phép phá tôi viết ra JS **không hợp lệ** (`break` nằm trong `if`), chẳng chứng minh được gì; đã viết lại.
- `seen(dotY)` tự nó không gánh việc — lề 14px của viewBox đã che đủ chấm nhích 5px. Nay phép phá kiểm **cả cặp**: bỏ đo *và* đẩy chấm ra xa.
- **Phụ thuộc:** T1, T3

### T16 · Chơi bằng bàn phím máy tính — ✅ XONG
Bố cục hai hàng quen thuộc: **A S D F G H J K** là phím trắng, **W E T Y U** là phím đen nằm đúng các khe giữa chúng như trên đàn thật. **Z / X** đổi quãng tám (C2–C5).

Giữ phím không gõ lại nốt (`event.repeat`), phím tắt trình duyệt (Ctrl/Cmd/Alt) trả về cho trình duyệt, và **gõ vào ô nhập liệu là gõ chữ chứ không phải chơi đàn** — kể cả `<select>` và vùng `contenteditable`, không riêng `<input>`.

**Nhãn ARIA:** mỗi phím nay có `role="button"`, `tabindex="0"` và `aria-label="Nốt <tên nốt>"`. Bàn phím ở đây *là* toàn bộ giao diện, để nguyên nó thành một đống `div` không nhãn là chặn cửa người dùng.

Thêm 34 phép kiểm tra, kiểm chứng bằng 16 phép phá — bắt được cả 16. Phép kiểm tra đối chiếu bố cục với **chính cây đàn nó mô phỏng**: hàng giữa phải leo đúng thứ tự phím trắng, và phím nào là phím đen thì suy từ việc nốt đó có dấu thăng hay không, chứ không tin nhãn `colour` trong bảng. Một phép lọt lúc đầu vì chốt chặn "phím ngoài bàn đàn" không với tới được qua giao diện (quãng tám đã bị khoá 2–5) — nhưng hàm vẫn nhận quãng tám bất kỳ từ người gọi, nên nay kiểm đúng hợp đồng đó.

### T17 · Bàn phím đàn trên màn hình nhỏ — ✅ XONG
Làm **cả hai** cách đã cân nhắc, vì một mình không cách nào đủ.

**Vị trí phím đen nay suy ra, không lưu cứng.** Trước đó mỗi phím đen mang một số pixel (`pos: 28`, `pos: 72`, …) chỉ đúng với đúng một bề rộng phím và đúng một độ dài bàn phím. Nay tính bằng số phím trắng đứng trước nó *trong phần đang hiện*, đặt qua `calc(var(--white-key-w) * n)`. Đã đối chiếu: cả **20 phím đen** rơi đúng chỗ cũ, không lệch một pixel. 20 số pixel trong dữ liệu đã xoá.

**Chế độ 2 quãng tám** (C3–C5, 25 phím / 15 phím trắng) bên cạnh chế độ toàn bộ.

**Thu nhỏ trên màn hình hẹp** (`max-width: 640px`): phím trắng 22px, phím đen 14px, vỏ đàn bớt padding, ẩn dòng tên nốt phụ.

Ghép lại: 15 × 22 + 16 = **346px, lọt màn 360px không phải cuộn** — đúng điều mục này đặt ra. Lần đầu tôi để 30px, phép kiểm tra tính ra 450px và **bắt ngay**: vẫn phải cuộn, tức chưa giải quyết được gì.

Thêm 26 phép kiểm tra, kiểm chứng bằng 14 phép phá — bắt được cả 14. Trong đó có phép chốt rằng **không còn số pixel nào nằm trong dữ liệu nốt**, vì vị trí suy ra và vị trí lưu sẵn để cạnh nhau thì sớm muộn cũng lệch.

## Nợ kỹ thuật

### T18 · ~~Sửa email tác giả commit đầu~~ — KHÔNG LÀM
`4ebdca2` mang email `thangwskof@...` của username cũ nên GitHub không gán commit đó về profile. Sửa được bằng `git commit --amend` + cherry-pick + force-push, nhưng đã quyết định bỏ: lợi ích chỉ là avatar của một commit, không đáng đánh đổi việc viết lại lịch sử. Ba commit sau đều đã đúng email.

### T19 · Tách file — ✅ XONG
Ngưỡng ~150KB mà mục này tự đặt ra **đã bị vượt** (164KB trước khi tách), nên điều kiện kích hoạt. Đã tách làm ba:

| File | Dòng | Kích thước |
|---|---|---|
| `index.html` | 591 | 32KB |
| `styles.css` | 156 | 4KB |
| `app.js` | 2432 | 114KB |

Vẫn không có build step; GitHub Pages phục vụ ba file cũng như một.

**Đã đối chiếu từng byte:** chụp lại cả 1486 lượt vẽ của renderer sau khi tách — giống hệt bản gốc. Việc bỏ thụt lề lúc tách đã lỡ cắt 4 khoảng trắng **bên trong hai template literal in thẳng ra SVG** (đầu nốt và ký hiệu khoá Fa); ảnh chụp bắt được và đã khôi phục. Các template sinh HTML còn lại thì khoảng trắng không có tác dụng gì nên để nguyên.

**Việc tách còn lột ra một phép kiểm tra đỗ vì lý do sai.** Phép "mọi id script tra cứu đều có trong markup" trước đây đọc cả file, nên một id do *chính script* sinh ra (`lesson-result`) vẫn được tính là "có trong markup". Tách ra thì lộ: id đó chưa từng nằm trong markup. Nay phép kiểm tra phân biệt rõ id của trang và id do script tạo.

### T21 · Đưa bộ phá có chủ đích vào repo — ✅ XONG
Suốt các mục trên, bộ phá chỉ nằm ở thư mục tạm — tức thứ chống đỡ toàn bộ tiêu chuẩn chất lượng của dự án lại không được lưu giữ. Đúng lý do T20 đưa `verify.js` vào repo.

Nay ở `tools/break/`: 17 bộ, một bộ chạy dùng chung (`harness.js`), và `all.js` chạy tất cả. Bộ chạy **tự dò mutation nhắm vào file nào** trong ba file nguồn, và báo `STALE` khi một mutation không còn khớp đoạn code nào.

Bằng chứng là cần thiết: ngay khi đưa vào repo, **103 trên 269 mutation báo STALE** — tất cả vì chúng chép nguyên văn code kèm thụt lề cũ của HTML. Trước đó ba bộ đã âm thầm lỗi thời từ lúc nào không hay, và không gì báo cho biết.

### T20 · Đưa script kiểm thử vào repo — ✅ XONG
`tools/verify.js`, chạy bằng `node tools/verify.js`, exit khác 0 khi có lỗi.

Đối chiếu bằng **nguồn độc lập**: suy vị trí nốt từ tên nốt qua công thức bậc quãng, không đọc `step`/`acc` trong dữ liệu — so với chính trường mà renderer dùng thì sửa sai dữ liệu sẽ làm cả hai vế cùng đổi và phép kiểm tra thành vô nghĩa. Số dòng kẻ phụ đếm trên SVG thật chứ không tính lại.

Đã kiểm chứng bằng 8 phép phá có chủ đích, bắt được cả 8: khôi phục fallback `step: 0`, đặt sai bậc nốt, xoá dấu thăng, trả lại vòng lặp dòng kẻ phụ thừa, quay về ký âm giáng, phá `scrollKeyboardTo`, bỏ viewBox co giãn, xoá một nốt khỏi dữ liệu.

**Bổ sung sau T6 — đối chiếu HTML với script.** Mọi phép kiểm tra khác chỉ nạp khối `<script>` và không hề nhìn phần HTML quanh nó, nên một nút gắn vào hàm gõ sai tên sẽ lọt hoàn toàn cho tới khi có người bấm. Hai nửa này chỉ nối với nhau bằng cái tên, nên nay đối chiếu tên: mọi `onclick`/`oninput`/`onchange` phải trỏ tới hàm có thật, không id nào trùng, và mọi `getElementById` với tên cố định phải có phần tử tương ứng. Khối này chạy **đầu tiên** để lỗi tên được gọi đúng tên thay vì hiện ra thành stack trace ở tận phần âm thanh.

Kiểm chứng bằng 5 phép phá — bắt được cả 5. Phép "đổi tên hàm nhưng bỏ quên cái nút" dừng ngay ở danh sách export với `ReferenceError` chỉ đúng tên hàm, chứ không phải ở một phép kiểm tra có tên; chấp nhận được vì nó tức thì và rõ ràng.

Tổng cộng: **665 phép kiểm tra**, kiểm chứng bằng **269 phép phá có chủ đích** trên 17 bộ, chạy bằng `node tools/break/all.js`.

## Giai đoạn 5 — Từ tài liệu thành người dạy

Ba mục này đến từ một câu hỏi thẳng: *trang đã đủ cho người tự học đàn organ tại nhà chưa?* Câu trả lời lúc đó là **chưa** — phần đọc nhạc thì vững, nhưng trang chỉ *trình bày*, không bao giờ *chấm*, và không có gì đặc thù organ.

### T22 · Chấm bài người học bấm — ✅ XONG
Lỗ hổng lớn nhất: `handleKeyClick` chỉ phát tiếng, **không bao giờ đối chiếu** với nốt đáng lẽ phải bấm. Người tự học không có thầy ngồi cạnh, nên không có cách nào biết mình đúng hay sai.

`startPractice(items, { clef, timeSig })` rồi mọi phím bấm — chuột hay bàn phím máy tính — đều đi qua `gradeKeyPress(key)`. Nốt đang chờ tô xanh trên khuông và viền xanh trên phím. Đúng thì đi tiếp, **sai thì đứng yên**: được chỉ ra nốt nào cần bấm rồi tự tìm lấy mới là điều đáng học. Đếm đúng/sai, tính độ chính xác, ghi lại từng lỗi kèm nốt lẽ ra phải bấm.

Hợp âm đòi **đủ mọi nốt, thứ tự nào cũng được** — nền sẵn cho T23. Dấu lặng bước qua chứ không đứng chờ một phím sẽ không bao giờ tới.

**Cố ý không chấm theo nhịp.** Đúng trước, nhanh sau — chính là điều bài 10 dặn người học. Chơi đúng tốc độ là kỹ năng khác và cần một bài tập khác.

Bảy nguồn để tập: câu tập đọc, gam hai tay, bốn bài hát. Mỗi nguồn mang theo **nhịp của chính nó**; áp cứng 4/4 lên mọi đoạn khiến khuông kêu ca về những ô nhịp vốn hoàn toàn đúng.

Thêm 38 phép kiểm tra, kiểm chứng bằng 24 phép phá — bắt được cả 24. **Ba phép lọt lúc đầu**, và cả ba đều đáng:
- Hai điều kiện trong `gradeKeyPress` hoá ra **chết hoàn toàn** — `practiceExpected()` đã chặn sẵn cả hai trường hợp. Đã xoá thay vì viết test cho chúng.
- Không phép nào kiểm **việc nối dây**: động cơ chấm điểm chạy đúng nhưng chẳng ai kiểm nó có được gọi khi bấm phím thật hay không. Nay kiểm cả hai đường vào.

### T23 · Khuông kép và bài hai tay — ✅ XONG
Bài 10 dạy ghép hai tay nhưng **không có tài liệu nào để tập**: cả 4 bài đều khoá Sol, không có khuông kép, không bài nào ghép giai điệu với hợp âm.

**Tách `drawStaffItem` ra khỏi `renderScoreSVG`** để khuông thứ hai dùng lại được cùng đoạn code vẽ nốt. Đây là ca mổ lớn nhất từ đầu dự án — ảnh chụp **1486 lượt vẽ** làm trọng tài, và không đổi một byte. (Lần nữa lại vấp đúng cái bẫy của T19: lệnh bỏ thụt lề cắt luôn khoảng trắng bên trong template in ra SVG; ảnh chụp bắt được.)

Điểm khác biệt thật giữa khuông kép và "hai khuông xếp chồng" là nốt phải **thẳng hàng theo thời gian**. Nên `renderGrandStaff` đặt vị trí theo **phách cộng dồn**, không theo chỉ số như `renderScoreSVG`: tám nốt móc đơn tay phải và một nốt tròn tay trái phủ đúng cùng một khoảng. Vạch nhịp chạy xuyên cả hai khuông; dấu ngoặc ôm nói đây là một nhạc cụ hai tay. Hai tay dài ngắn khác nhau thì **báo cảnh báo** chứ không lặng lẽ vẽ bừa.

Bài "Ánh Sao Nhỏ — hai tay": **tay trái viết bằng tên hợp âm**, nốt lấy từ `CHORDS` qua `chordVoicing` — hợp âm chỉ được viết ra ở đúng một chỗ trong dự án, và T8 đã đối chiếu chỗ đó với nhạc lý rồi.

Tập hai tay dùng lại y nguyên phần chấm điểm của T22: mọi nốt **khởi đầu cùng một thời điểm** gộp thành một "hợp âm" phải bấm đủ — mà T22 vốn đã biết chờ hợp âm.

Thêm 36 phép kiểm tra, kiểm chứng bằng 23 phép phá — bắt được cả 23. **Năm phép lọt lúc đầu**, ba do phép kiểm tra quá lỏng và hai do mutation tôi viết không phá gì thật:
- "Các nốt cách đều nhau" **đúng cả khi mọi nốt chồng lên một chỗ** (mọi khoảng cách đều bằng 0). Thêm phép đòi nốt phải tiến sang phải.
- Mọi phím đều có mặt ở cả hai khoá, nên **đọc tay trái bằng khoá Sol** vẫn vẽ ra nốt — chỉ là sai dòng, và không gì kêu. Nay chốt đúng độ cao của một nốt đã biết.
- Đổi hợp âm F thành G thì **cả hai vế của phép kiểm tra cùng đổi**, nên không bắt được. Nay kiểm bằng nhạc lý: mọi nốt giai điệu phải là nốt của hợp âm đang đỡ nó — hoà thanh sai thì lộ ngay.

## Việc chưa kiểm chứng

### ~~Âm thanh chưa ai nghe thử~~ — ✅ ĐÃ NGHE (2026-09-16)
Mục treo từ đầu backlog, nay đã dứt: đã nghe thử trên trình duyệt, **có tiếng và nghe ổn**. Đó là thứ bộ kiểm tra không với tới được — nó dựng một `AudioContext` giả nên chứng minh được **hình dạng đồ thị và lịch phát** (không gì nối thẳng vào loa, đường bao lên xuống đúng thứ tự, thời điểm lấy từ `AudioContext.currentTime`, không oscillator nào bị bỏ quên), nhưng không chứng minh nổi là có âm thanh phát ra.

Nhờ vậy năm tính năng dựng trên nền này đứng vững: động cơ ADSR (T7), máy gõ nhịp (T5), bộ phát câu nhạc (T6), hợp âm (T8), luyện tai (T12).

Lưu ý phạm vi: đây là **nghe thử một lượt**, không phải rà từng tính năng. Nếu mới chỉ bấm phím đàn thì máy gõ nhịp, nút "Phát", hợp âm và luyện tai vẫn đáng bấm thử mỗi thứ một lần — đặc biệt là hợp âm, vì đó là chỗ duy nhất có bốn nốt chồng lên nhau và là lý do T7 phải thêm limiter.

### Bài hát Việt Nam
Xem phần "Còn thiếu" ở T10: **Lý Cây Xanh** và **Bắc Kim Thang** thuộc phạm vi công cộng và nên có mặt, nhưng tôi không đủ chắc về cao độ từng nốt, mà mã hoá sai giai điệu thì tệ hơn là thiếu bài.

### Giao diện chưa ai nhìn
Cũng như âm thanh: bố cục, màu, khoảng cách của những thẻ mới thêm đều chỉ được kiểm bằng cách đọc markup. Riêng bàn phím trên màn hình hẹp thì có tính ra số (346px lọt màn 360px), còn lại thì chưa ai nhìn tận mắt.
