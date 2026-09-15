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

Chưa có — app mới dạy **cao độ**, toàn bộ mảng **trường độ** vắng mặt:

| Khái niệm | Trạng thái |
|---|---|
| Hình nốt (tròn, trắng, đen, móc đơn) | ✅ T1 |
| Dấu lặng | ✅ T2 |
| Số chỉ nhịp, vạch nhịp, ô nhịp | ✅ T3 |
| Tiết tấu, máy gõ nhịp | máy gõ nhịp ✅ T5 |
| Hợp âm tay trái | chưa có — thiếu sót lớn nhất với organ |
| Gam, ngón bấm | số ngón ✅ T4, gam chưa có |
| Bài hát tập chơi | chưa có |
| Lộ trình bài học có thứ tự | chưa có |

## Chạy kiểm thử

```
node tools/verify.js
```

Chỉ cần Node, không cài gì thêm. **Bắt buộc chạy sau mỗi thay đổi `renderScoreSVG` hoặc dữ liệu nốt** — T1–T4 đều sửa renderer.

## Nguyên tắc kỹ thuật

- Giữ **một file `index.html` tự chứa**, không build step — deploy thẳng lên GitHub Pages
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

### T6 · Phát chuỗi nốt theo trường độ
Phát một dãy nốt đúng tiết tấu, sáng phím đồng bộ, có tạm dừng / tốc độ chậm / lặp từng câu.
- Lập lịch bằng `AudioContext.currentTime`, **không** dùng `setTimeout` cho thời điểm phát
- **Phụ thuộc:** T5

### T7 · Nâng chất lượng âm thanh — ✅ XONG
Làm **trước T5/T6**: cả máy gõ nhịp lẫn bộ phát đều dựng trên động cơ này, sửa sau sẽ phải làm lại.

Mọi thứ phát ra tiếng đều đi qua đúng một chuỗi: `oscillator → gain ADSR riêng từng nốt → limiter → master gain → loa`. **Không gì nối thẳng vào `ctx.destination`** — đó chính là thứ giữ cho hợp âm không cộng biên độ vượt mức. Đỉnh mỗi nốt hạ từ `0.3` xuống `0.22`, nên bốn nốt cùng lúc vẫn nằm trong khoảng.

`playTone(freq, opts)` nhận thêm `at` (thời điểm phát, tính theo giờ của AudioContext — T6 cần), `hold`, và `voice`. Có `voice` thì bấm lại cùng phím sẽ **tắt dần** nốt cũ trong 30ms rồi mới đánh nốt mới, thay vì chồng lên nhau; tắt phụt sẽ nghe "cạch".

Thêm 27 phép kiểm tra, dựng một `AudioContext` giả ghi lại mọi lời gọi lập lịch, kiểm chứng bằng 16 phép phá — bắt được cả 16.

> **Giới hạn:** bộ kiểm tra này chứng minh **hình dạng đồ thị và lịch phát**, không chứng minh có tiếng kêu. Việc "âm thanh chưa test thật trên trình duyệt" ở cuối file vẫn còn nguyên.

## Giai đoạn 3 — Nội dung giảng dạy

### T8 · Hợp âm tay trái
C, Dm, Em, F, G, G7, Am — thế gốc và thế đảo cơ bản.
- Sáng nhiều phím cùng lúc, hiện tên hợp âm trên khuông, phát kiểu chặn và kiểu rải
- Vòng hợp âm phổ biến: C–G–Am–F, C–Am–F–G
- **Phụ thuộc:** T7

### T9 · Gam Đô trưởng & ngón bấm
Gam đi lên/xuống hai tay, số ngón, kỹ thuật luồn ngón cái.
- **Phụ thuộc:** T4, T6

### T10 · Bài hát tập chơi
4–6 bài vỡ lòng (dân ca / thiếu nhi quen thuộc, **chỉ chọn bài thuộc phạm vi công cộng**).
- Hiện khuông nhạc đầy đủ, sáng phím theo từng nốt, chỉnh tốc độ, tập từng câu
- **Phụ thuộc:** T3, T6

### T11 · Lộ trình bài học
Tab "Bài Học" gồm ~10 bài đánh số, mỗi bài có lý thuyết → thực hành → kiểm tra.
Lưu tiến độ vào `localStorage`.
- Bài 1 nhận biết bàn phím, tìm Đô qua nhóm 2/3 phím đen
- Bài 2 khuông nhạc và khóa Sol
- Bài 3 đọc nốt khóa Sol
- Bài 4 khóa Fa và tay trái
- Bài 5 trường độ
- Bài 6 nhịp 4/4 và vạch nhịp
- Bài 7 dấu lặng
- Bài 8 gam Đô trưởng và ngón bấm
- Bài 9 hợp âm tay trái
- Bài 10 ghép hai tay, bài hát đầu tiên
- **Phụ thuộc:** T1–T10

## Giai đoạn 4 — Mở rộng

### T12 · Luyện tai
Nghe nốt / quãng rồi chọn đáp án. Tận dụng lại engine game sẵn có.

### T13 · Quãng
Quãng 2 đến quãng 8, nhận biết trên khuông và trên phím.

### T14 · Dấu giáng và hóa biểu
Dữ liệu hiện chỉ có nốt thăng (`acc: "♯"`). Thêm cách ghi giáng và hóa biểu đầu khuông.
- Cần quyết định: ghi trùng âm (C♯/D♭) hiển thị thế nào

### T15 · Nốt chấm dôi và dấu nối
- **Phụ thuộc:** T1, T3

### T16 · Chơi bằng bàn phím máy tính
Gán phím máy tính vào phím đàn, thêm nhãn ARIA cho phím.

### T17 · Bàn phím đàn trên màn hình nhỏ
29 phím trắng × 44px + 32px padding = 1308px (phím đen định vị absolute nên không cộng bề ngang), hiện phải cuộn ngang trên điện thoại. Cân nhắc thu nhỏ hoặc chế độ 2 quãng tám.

## Nợ kỹ thuật

### T18 · ~~Sửa email tác giả commit đầu~~ — KHÔNG LÀM
`4ebdca2` mang email `thangwskof@...` của username cũ nên GitHub không gán commit đó về profile. Sửa được bằng `git commit --amend` + cherry-pick + force-push, nhưng đã quyết định bỏ: lợi ích chỉ là avatar của một commit, không đáng đánh đổi việc viết lại lịch sử. Ba commit sau đều đã đúng email.

### T19 · Cân nhắc tách file
`index.html` đang 78KB / 1421 dòng và sẽ phình nhanh khi thêm bài học.
Nếu vượt ~150KB thì tách CSS/JS ra file riêng — Pages phục vụ nhiều file bình thường, vẫn không cần build step.

### T20 · Đưa script kiểm thử vào repo — ✅ XONG
`tools/verify.js`, chạy bằng `node tools/verify.js`, exit khác 0 khi có lỗi.

Đối chiếu bằng **nguồn độc lập**: suy vị trí nốt từ tên nốt qua công thức bậc quãng, không đọc `step`/`acc` trong dữ liệu — so với chính trường mà renderer dùng thì sửa sai dữ liệu sẽ làm cả hai vế cùng đổi và phép kiểm tra thành vô nghĩa. Số dòng kẻ phụ đếm trên SVG thật chứ không tính lại.

Đã kiểm chứng bằng 8 phép phá có chủ đích, bắt được cả 8: khôi phục fallback `step: 0`, đặt sai bậc nốt, xoá dấu thăng, trả lại vòng lặp dòng kẻ phụ thừa, quay về ký âm giáng, phá `scrollKeyboardTo`, bỏ viewBox co giãn, xoá một nốt khỏi dữ liệu.

## Việc chưa kiểm chứng

- **Âm thanh chưa test thật trên trình duyệt.** Extension Chrome treo lúc kiểm tra. `playTone` có gọi `audioCtx.resume()` khi bị suspend, nhưng cần xác nhận tiếng thực sự phát ra sau cú click đầu tiên.
