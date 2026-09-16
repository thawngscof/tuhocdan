// Comprehensive Notes Database Dictionary
const notesData = {
  treble: [
    { key: "c/2", step: -16, name: "Đô", noteName: "C2", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 8 bên dưới khuông Khóa Sol.", freq: 65.41, tag: "ledger" },
    { key: "c#/2", step: -16, name: "Đô thăng", noteName: "C#2", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 8 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 69.30, tag: "accidental" },
    { key: "d/2", step: -15, name: "Rê", noteName: "D2", acc: null, desc: "Dưới Dòng kẻ phụ thứ 7 bên dưới khuông Khóa Sol.", freq: 73.42, tag: "ledger" },
    { key: "d#/2", step: -15, name: "Rê thăng", noteName: "D#2", acc: "♯", desc: "Dưới Dòng kẻ phụ thứ 7 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 77.78, tag: "accidental" },
    { key: "e/2", step: -14, name: "Mi", noteName: "E2", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 7 bên dưới khuông Khóa Sol.", freq: 82.41, tag: "ledger" },
    { key: "f/2", step: -13, name: "Pha", noteName: "F2", acc: null, desc: "Dưới Dòng kẻ phụ thứ 6 bên dưới khuông Khóa Sol.", freq: 87.31, tag: "ledger" },
    { key: "f#/2", step: -13, name: "Pha thăng", noteName: "F#2", acc: "♯", desc: "Dưới Dòng kẻ phụ thứ 6 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 92.50, tag: "accidental" },
    { key: "g/2", step: -12, name: "Sol", noteName: "G2", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 6 bên dưới khuông Khóa Sol.", freq: 98.00, tag: "ledger" },
    { key: "g#/2", step: -12, name: "Sol thăng", noteName: "G#2", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 6 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 103.83, tag: "accidental" },
    { key: "a/2", step: -11, name: "La", noteName: "A2", acc: null, desc: "Dưới Dòng kẻ phụ thứ 5 bên dưới khuông Khóa Sol.", freq: 110.00, tag: "ledger" },
    { key: "a#/2", step: -11, name: "La thăng", noteName: "A#2", acc: "♯", desc: "Dưới Dòng kẻ phụ thứ 5 bên dưới khuông Khóa Sol. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 116.54, tag: "accidental" },
    { key: "b/2", step: -10, name: "Si", noteName: "B2", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 5 bên dưới khuông Khóa Sol.", freq: 123.47, tag: "ledger" },
    { key: "c/3", step: -9, name: "Đô", noteName: "C3", acc: null, desc: "Dưới Dòng kẻ phụ thứ 4 bên dưới khuông Khóa Sol.", freq: 130.81, tag: "ledger" },
    { key: "c#/3", step: -9, name: "Đô thăng", noteName: "C#3", acc: "♯", desc: "Dưới Dòng kẻ phụ thứ 4 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 138.59, tag: "accidental" },
    { key: "d/3", step: -8, name: "Rê", noteName: "D3", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 4 bên dưới khuông Khóa Sol.", freq: 146.83, tag: "ledger" },
    { key: "d#/3", step: -8, name: "Rê thăng", noteName: "D#3", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 4 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 155.56, tag: "accidental" },
    { key: "e/3", step: -7, name: "Mi", noteName: "E3", acc: null, desc: "Dưới Dòng kẻ phụ thứ 3 bên dưới khuông Khóa Sol.", freq: 164.81, tag: "ledger" },
    { key: "f/3", step: -6, name: "Pha", noteName: "F3", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 3 bên dưới khuông Khóa Sol.", freq: 174.61, tag: "ledger" },
    { key: "f#/3", step: -6, name: "Pha thăng", noteName: "F#3", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 3 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 185.00, tag: "accidental" },
    { key: "g/3", step: -5, name: "Sol", noteName: "G3", acc: null, desc: "Dưới Dòng kẻ phụ thứ 2 bên dưới khuông Khóa Sol.", freq: 196.00, tag: "ledger" },
    { key: "g#/3", step: -5, name: "Sol thăng", noteName: "G#3", acc: "♯", desc: "Dưới Dòng kẻ phụ thứ 2 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 207.65, tag: "accidental" },
    { key: "a/3", step: -4, name: "La", noteName: "A3", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 2 bên dưới khuông Khóa Sol.", freq: 220.00, tag: "ledger" },
    { key: "a#/3", step: -4, name: "La thăng", noteName: "A#3", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 2 bên dưới khuông Khóa Sol. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 233.08, tag: "accidental" },
    { key: "b/3", step: -3, name: "Si", noteName: "B3", acc: null, desc: "Dưới Dòng kẻ phụ thứ 1 bên dưới khuông Khóa Sol.", freq: 246.94, tag: "ledger" },
    { key: "c/4", step: -2, name: "Đô", noteName: "C4", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 1 bên dưới khuông Khóa Sol — đây là Đô Trung (Middle C).", freq: 261.63, tag: "normal" },
    { key: "c#/4", step: -2, name: "Đô thăng", noteName: "C#4", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 1 bên dưới khuông Khóa Sol. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 277.18, tag: "accidental" },
    { key: "d/4", step: -1, name: "Rê", noteName: "D4", acc: null, desc: "Sát bên dưới Dòng kẻ thứ 1 của Khóa Sol.", freq: 293.66, tag: "normal" },
    { key: "d#/4", step: -1, name: "Rê thăng", noteName: "D#4", acc: "♯", desc: "Sát bên dưới Dòng kẻ thứ 1 của Khóa Sol. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 311.13, tag: "accidental" },
    { key: "e/4", step: 0, name: "Mi", noteName: "E4", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 1 của Khóa Sol.", freq: 329.63, tag: "normal" },
    { key: "f/4", step: 1, name: "Pha", noteName: "F4", acc: null, desc: "Nằm trong Khe thứ 1 của Khóa Sol.", freq: 349.23, tag: "normal" },
    { key: "f#/4", step: 1, name: "Pha thăng", noteName: "F#4", acc: "♯", desc: "Nằm trong Khe thứ 1 của Khóa Sol. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 369.99, tag: "accidental" },
    { key: "g/4", step: 2, name: "Sol", noteName: "G4", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 2 của Khóa Sol.", freq: 392.00, tag: "normal" },
    { key: "g#/4", step: 2, name: "Sol thăng", noteName: "G#4", acc: "♯", desc: "Nằm ngay trên Dòng kẻ thứ 2 của Khóa Sol. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 415.30, tag: "accidental" },
    { key: "a/4", step: 3, name: "La", noteName: "A4", acc: null, desc: "Nằm trong Khe thứ 2 của Khóa Sol.", freq: 440.00, tag: "normal" },
    { key: "a#/4", step: 3, name: "La thăng", noteName: "A#4", acc: "♯", desc: "Nằm trong Khe thứ 2 của Khóa Sol. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 466.16, tag: "accidental" },
    { key: "b/4", step: 4, name: "Si", noteName: "B4", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 3 của Khóa Sol.", freq: 493.88, tag: "normal" },
    { key: "c/5", step: 5, name: "Đô", noteName: "C5", acc: null, desc: "Nằm trong Khe thứ 3 của Khóa Sol.", freq: 523.25, tag: "normal" },
    { key: "c#/5", step: 5, name: "Đô thăng", noteName: "C#5", acc: "♯", desc: "Nằm trong Khe thứ 3 của Khóa Sol. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 554.37, tag: "accidental" },
    { key: "d/5", step: 6, name: "Rê", noteName: "D5", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 4 của Khóa Sol.", freq: 587.33, tag: "normal" },
    { key: "d#/5", step: 6, name: "Rê thăng", noteName: "D#5", acc: "♯", desc: "Nằm ngay trên Dòng kẻ thứ 4 của Khóa Sol. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 622.25, tag: "accidental" },
    { key: "e/5", step: 7, name: "Mi", noteName: "E5", acc: null, desc: "Nằm trong Khe thứ 4 của Khóa Sol.", freq: 659.26, tag: "normal" },
    { key: "f/5", step: 8, name: "Pha", noteName: "F5", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 5 của Khóa Sol.", freq: 698.46, tag: "normal" },
    { key: "f#/5", step: 8, name: "Pha thăng", noteName: "F#5", acc: "♯", desc: "Nằm ngay trên Dòng kẻ thứ 5 của Khóa Sol. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 739.99, tag: "accidental" },
    { key: "g/5", step: 9, name: "Sol", noteName: "G5", acc: null, desc: "Sát bên trên Dòng kẻ thứ 5 của Khóa Sol.", freq: 783.99, tag: "ledger" },
    { key: "g#/5", step: 9, name: "Sol thăng", noteName: "G#5", acc: "♯", desc: "Sát bên trên Dòng kẻ thứ 5 của Khóa Sol. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 830.61, tag: "accidental" },
    { key: "a/5", step: 10, name: "La", noteName: "A5", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 1 bên trên khuông Khóa Sol.", freq: 880.00, tag: "ledger" },
    { key: "a#/5", step: 10, name: "La thăng", noteName: "A#5", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 1 bên trên khuông Khóa Sol. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 932.33, tag: "accidental" },
    { key: "b/5", step: 11, name: "Si", noteName: "B5", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 1 bên trên khuông Khóa Sol.", freq: 987.77, tag: "ledger" },
    { key: "c/6", step: 12, name: "Đô", noteName: "C6", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 2 bên trên khuông Khóa Sol.", freq: 1046.50, tag: "ledger" }
  ],
  bass: [
    { key: "c/2", step: -4, name: "Đô", noteName: "C2", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 2 bên dưới khuông Khóa Fa.", freq: 65.41, tag: "ledger" },
    { key: "c#/2", step: -4, name: "Đô thăng", noteName: "C#2", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 2 bên dưới khuông Khóa Fa. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 69.30, tag: "accidental" },
    { key: "d/2", step: -3, name: "Rê", noteName: "D2", acc: null, desc: "Dưới Dòng kẻ phụ thứ 1 bên dưới khuông Khóa Fa.", freq: 73.42, tag: "ledger" },
    { key: "d#/2", step: -3, name: "Rê thăng", noteName: "D#2", acc: "♯", desc: "Dưới Dòng kẻ phụ thứ 1 bên dưới khuông Khóa Fa. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 77.78, tag: "accidental" },
    { key: "e/2", step: -2, name: "Mi", noteName: "E2", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 1 bên dưới khuông Khóa Fa.", freq: 82.41, tag: "ledger" },
    { key: "f/2", step: -1, name: "Pha", noteName: "F2", acc: null, desc: "Sát bên dưới Dòng kẻ thứ 1 của Khóa Fa.", freq: 87.31, tag: "normal" },
    { key: "f#/2", step: -1, name: "Pha thăng", noteName: "F#2", acc: "♯", desc: "Sát bên dưới Dòng kẻ thứ 1 của Khóa Fa. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 92.50, tag: "accidental" },
    { key: "g/2", step: 0, name: "Sol", noteName: "G2", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 1 của Khóa Fa.", freq: 98.00, tag: "normal" },
    { key: "g#/2", step: 0, name: "Sol thăng", noteName: "G#2", acc: "♯", desc: "Nằm ngay trên Dòng kẻ thứ 1 của Khóa Fa. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 103.83, tag: "accidental" },
    { key: "a/2", step: 1, name: "La", noteName: "A2", acc: null, desc: "Nằm trong Khe thứ 1 của Khóa Fa.", freq: 110.00, tag: "normal" },
    { key: "a#/2", step: 1, name: "La thăng", noteName: "A#2", acc: "♯", desc: "Nằm trong Khe thứ 1 của Khóa Fa. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 116.54, tag: "accidental" },
    { key: "b/2", step: 2, name: "Si", noteName: "B2", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 2 của Khóa Fa.", freq: 123.47, tag: "normal" },
    { key: "c/3", step: 3, name: "Đô", noteName: "C3", acc: null, desc: "Nằm trong Khe thứ 2 của Khóa Fa.", freq: 130.81, tag: "normal" },
    { key: "c#/3", step: 3, name: "Đô thăng", noteName: "C#3", acc: "♯", desc: "Nằm trong Khe thứ 2 của Khóa Fa. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 138.59, tag: "accidental" },
    { key: "d/3", step: 4, name: "Rê", noteName: "D3", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 3 của Khóa Fa.", freq: 146.83, tag: "normal" },
    { key: "d#/3", step: 4, name: "Rê thăng", noteName: "D#3", acc: "♯", desc: "Nằm ngay trên Dòng kẻ thứ 3 của Khóa Fa. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 155.56, tag: "accidental" },
    { key: "e/3", step: 5, name: "Mi", noteName: "E3", acc: null, desc: "Nằm trong Khe thứ 3 của Khóa Fa.", freq: 164.81, tag: "normal" },
    { key: "f/3", step: 6, name: "Pha", noteName: "F3", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 4 của Khóa Fa.", freq: 174.61, tag: "normal" },
    { key: "f#/3", step: 6, name: "Pha thăng", noteName: "F#3", acc: "♯", desc: "Nằm ngay trên Dòng kẻ thứ 4 của Khóa Fa. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 185.00, tag: "accidental" },
    { key: "g/3", step: 7, name: "Sol", noteName: "G3", acc: null, desc: "Nằm trong Khe thứ 4 của Khóa Fa.", freq: 196.00, tag: "normal" },
    { key: "g#/3", step: 7, name: "Sol thăng", noteName: "G#3", acc: "♯", desc: "Nằm trong Khe thứ 4 của Khóa Fa. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 207.65, tag: "accidental" },
    { key: "a/3", step: 8, name: "La", noteName: "A3", acc: null, desc: "Nằm ngay trên Dòng kẻ thứ 5 của Khóa Fa.", freq: 220.00, tag: "normal" },
    { key: "a#/3", step: 8, name: "La thăng", noteName: "A#3", acc: "♯", desc: "Nằm ngay trên Dòng kẻ thứ 5 của Khóa Fa. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 233.08, tag: "accidental" },
    { key: "b/3", step: 9, name: "Si", noteName: "B3", acc: null, desc: "Sát bên trên Dòng kẻ thứ 5 của Khóa Fa.", freq: 246.94, tag: "normal" },
    { key: "c/4", step: 10, name: "Đô", noteName: "C4", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 1 bên trên khuông Khóa Fa — đây là Đô Trung (Middle C).", freq: 261.63, tag: "ledger" },
    { key: "c#/4", step: 10, name: "Đô thăng", noteName: "C#4", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 1 bên trên khuông Khóa Fa. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 277.18, tag: "accidental" },
    { key: "d/4", step: 11, name: "Rê", noteName: "D4", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 1 bên trên khuông Khóa Fa.", freq: 293.66, tag: "ledger" },
    { key: "d#/4", step: 11, name: "Rê thăng", noteName: "D#4", acc: "♯", desc: "Sát bên trên Dòng kẻ phụ thứ 1 bên trên khuông Khóa Fa. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 311.13, tag: "accidental" },
    { key: "e/4", step: 12, name: "Mi", noteName: "E4", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 2 bên trên khuông Khóa Fa.", freq: 329.63, tag: "ledger" },
    { key: "f/4", step: 13, name: "Pha", noteName: "F4", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 2 bên trên khuông Khóa Fa.", freq: 349.23, tag: "ledger" },
    { key: "f#/4", step: 13, name: "Pha thăng", noteName: "F#4", acc: "♯", desc: "Sát bên trên Dòng kẻ phụ thứ 2 bên trên khuông Khóa Fa. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 369.99, tag: "accidental" },
    { key: "g/4", step: 14, name: "Sol", noteName: "G4", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 3 bên trên khuông Khóa Fa.", freq: 392.00, tag: "ledger" },
    { key: "g#/4", step: 14, name: "Sol thăng", noteName: "G#4", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 3 bên trên khuông Khóa Fa. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 415.30, tag: "accidental" },
    { key: "a/4", step: 15, name: "La", noteName: "A4", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 3 bên trên khuông Khóa Fa.", freq: 440.00, tag: "ledger" },
    { key: "a#/4", step: 15, name: "La thăng", noteName: "A#4", acc: "♯", desc: "Sát bên trên Dòng kẻ phụ thứ 3 bên trên khuông Khóa Fa. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 466.16, tag: "accidental" },
    { key: "b/4", step: 16, name: "Si", noteName: "B4", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 4 bên trên khuông Khóa Fa.", freq: 493.88, tag: "ledger" },
    { key: "c/5", step: 17, name: "Đô", noteName: "C5", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 4 bên trên khuông Khóa Fa.", freq: 523.25, tag: "ledger" },
    { key: "c#/5", step: 17, name: "Đô thăng", noteName: "C#5", acc: "♯", desc: "Sát bên trên Dòng kẻ phụ thứ 4 bên trên khuông Khóa Fa. Cùng vị trí với nốt Đô, thêm dấu thăng (#) phía trước.", freq: 554.37, tag: "accidental" },
    { key: "d/5", step: 18, name: "Rê", noteName: "D5", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 5 bên trên khuông Khóa Fa.", freq: 587.33, tag: "ledger" },
    { key: "d#/5", step: 18, name: "Rê thăng", noteName: "D#5", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 5 bên trên khuông Khóa Fa. Cùng vị trí với nốt Rê, thêm dấu thăng (#) phía trước.", freq: 622.25, tag: "accidental" },
    { key: "e/5", step: 19, name: "Mi", noteName: "E5", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 5 bên trên khuông Khóa Fa.", freq: 659.26, tag: "ledger" },
    { key: "f/5", step: 20, name: "Pha", noteName: "F5", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 6 bên trên khuông Khóa Fa.", freq: 698.46, tag: "ledger" },
    { key: "f#/5", step: 20, name: "Pha thăng", noteName: "F#5", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 6 bên trên khuông Khóa Fa. Cùng vị trí với nốt Pha, thêm dấu thăng (#) phía trước.", freq: 739.99, tag: "accidental" },
    { key: "g/5", step: 21, name: "Sol", noteName: "G5", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 6 bên trên khuông Khóa Fa.", freq: 783.99, tag: "ledger" },
    { key: "g#/5", step: 21, name: "Sol thăng", noteName: "G#5", acc: "♯", desc: "Sát bên trên Dòng kẻ phụ thứ 6 bên trên khuông Khóa Fa. Cùng vị trí với nốt Sol, thêm dấu thăng (#) phía trước.", freq: 830.61, tag: "accidental" },
    { key: "a/5", step: 22, name: "La", noteName: "A5", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 7 bên trên khuông Khóa Fa.", freq: 880.00, tag: "ledger" },
    { key: "a#/5", step: 22, name: "La thăng", noteName: "A#5", acc: "♯", desc: "Nằm ở Dòng kẻ phụ thứ 7 bên trên khuông Khóa Fa. Cùng vị trí với nốt La, thêm dấu thăng (#) phía trước.", freq: 932.33, tag: "accidental" },
    { key: "b/5", step: 23, name: "Si", noteName: "B5", acc: null, desc: "Sát bên trên Dòng kẻ phụ thứ 7 bên trên khuông Khóa Fa.", freq: 987.77, tag: "ledger" },
    { key: "c/6", step: 24, name: "Đô", noteName: "C6", acc: null, desc: "Nằm ở Dòng kẻ phụ thứ 8 bên trên khuông Khóa Fa.", freq: 1046.50, tag: "ledger" }
  ]
};

// Full Organ Keyboard Layout Data (C2 to C6 - 4 Octaves)
const keyboardKeys = [
  { key: "c/2", name: "Đô", noteName: "C2", type: "white", freq: 65.41 },
  { key: "c#/2", name: "Đô thăng", noteName: "C#2", type: "black", freq: 69.30 },
  { key: "d/2", name: "Rê", noteName: "D2", type: "white", freq: 73.42 },
  { key: "d#/2", name: "Rê thăng", noteName: "D#2", type: "black", freq: 77.78 },
  { key: "e/2", name: "Mi", noteName: "E2", type: "white", freq: 82.41 },
  { key: "f/2", name: "Pha", noteName: "F2", type: "white", freq: 87.31 },
  { key: "f#/2", name: "Pha thăng", noteName: "F#2", type: "black", freq: 92.50 },
  { key: "g/2", name: "Sol", noteName: "G2", type: "white", freq: 98.00 },
  { key: "g#/2", name: "Sol thăng", noteName: "G#2", type: "black", freq: 103.83 },
  { key: "a/2", name: "La", noteName: "A2", type: "white", freq: 110.00 },
  { key: "a#/2", name: "La thăng", noteName: "A#2", type: "black", freq: 116.54 },
  { key: "b/2", name: "Si", noteName: "B2", type: "white", freq: 123.47 },
  { key: "c/3", name: "Đô", noteName: "C3", type: "white", freq: 130.81 },
  { key: "c#/3", name: "Đô thăng", noteName: "C#3", type: "black", freq: 138.59 },
  { key: "d/3", name: "Rê", noteName: "D3", type: "white", freq: 146.83 },
  { key: "d#/3", name: "Rê thăng", noteName: "D#3", type: "black", freq: 155.56 },
  { key: "e/3", name: "Mi", noteName: "E3", type: "white", freq: 164.81 },
  { key: "f/3", name: "Pha", noteName: "F3", type: "white", freq: 174.61 },
  { key: "f#/3", name: "Pha thăng", noteName: "F#3", type: "black", freq: 185.00 },
  { key: "g/3", name: "Sol", noteName: "G3", type: "white", freq: 196.00 },
  { key: "g#/3", name: "Sol thăng", noteName: "G#3", type: "black", freq: 207.65 },
  { key: "a/3", name: "La", noteName: "A3", type: "white", freq: 220.00 },
  { key: "a#/3", name: "La thăng", noteName: "A#3", type: "black", freq: 233.08 },
  { key: "b/3", name: "Si", noteName: "B3", type: "white", freq: 246.94 },
  { key: "c/4", name: "Đô", noteName: "C4", type: "white", freq: 261.63 },
  { key: "c#/4", name: "Đô thăng", noteName: "C#4", type: "black", freq: 277.18 },
  { key: "d/4", name: "Rê", noteName: "D4", type: "white", freq: 293.66 },
  { key: "d#/4", name: "Rê thăng", noteName: "D#4", type: "black", freq: 311.13 },
  { key: "e/4", name: "Mi", noteName: "E4", type: "white", freq: 329.63 },
  { key: "f/4", name: "Pha", noteName: "F4", type: "white", freq: 349.23 },
  { key: "f#/4", name: "Pha thăng", noteName: "F#4", type: "black", freq: 369.99 },
  { key: "g/4", name: "Sol", noteName: "G4", type: "white", freq: 392.00 },
  { key: "g#/4", name: "Sol thăng", noteName: "G#4", type: "black", freq: 415.30 },
  { key: "a/4", name: "La", noteName: "A4", type: "white", freq: 440.00 },
  { key: "a#/4", name: "La thăng", noteName: "A#4", type: "black", freq: 466.16 },
  { key: "b/4", name: "Si", noteName: "B4", type: "white", freq: 493.88 },
  { key: "c/5", name: "Đô", noteName: "C5", type: "white", freq: 523.25 },
  { key: "c#/5", name: "Đô thăng", noteName: "C#5", type: "black", freq: 554.37 },
  { key: "d/5", name: "Rê", noteName: "D5", type: "white", freq: 587.33 },
  { key: "d#/5", name: "Rê thăng", noteName: "D#5", type: "black", freq: 622.25 },
  { key: "e/5", name: "Mi", noteName: "E5", type: "white", freq: 659.26 },
  { key: "f/5", name: "Pha", noteName: "F5", type: "white", freq: 698.46 },
  { key: "f#/5", name: "Pha thăng", noteName: "F#5", type: "black", freq: 739.99 },
  { key: "g/5", name: "Sol", noteName: "G5", type: "white", freq: 783.99 },
  { key: "g#/5", name: "Sol thăng", noteName: "G#5", type: "black", freq: 830.61 },
  { key: "a/5", name: "La", noteName: "A5", type: "white", freq: 880.00 },
  { key: "a#/5", name: "La thăng", noteName: "A#5", type: "black", freq: 932.33 },
  { key: "b/5", name: "Si", noteName: "B5", type: "white", freq: 987.77 },
  { key: "c/6", name: "Đô", noteName: "C6", type: "white", freq: 1046.50 }
];

// State Variables
let currentClef = 'treble';
let currentSelectedNote = notesData.treble[3]; // C4
let audioCtx = null;
let masterGain = null;        // single output stage - see ensureAudio()
let masterLimiter = null;
const activeVoices = new Map();   // voice id -> the note currently sounding on it

// One oscillator per note shaped by an ADSR, which T24 moved into the voice
// table so each sound has its own. The peak is deliberately low: a four-note
// chord at the old flat 0.3 summed past full scale and came out as a buzz, so
// every voice goes through a shared limiter instead.
const VOICE_PEAK = 0.22;
const SILENT = 0.0001;        // exponential ramps cannot reach zero
let quizScore = 0;
let quizStreak = 0;
let quizCurrentQuestion = null;

// Note durations. `beats` counts quarter notes, so a 4/4 bar holds 4.
// Kept at module scope because bar-line grouping will need the same numbers.
const DURATIONS = {
  w: { beats: 4,   hollow: true,  stem: false, flags: 0, name: "nốt tròn",     restName: "lặng tròn" },
  h: { beats: 2,   hollow: true,  stem: true,  flags: 0, name: "nốt trắng",    restName: "lặng trắng" },
  q: { beats: 1,   hollow: false, stem: true,  flags: 0, name: "nốt đen",      restName: "lặng đen" },
  e: { beats: 0.5, hollow: false, stem: true,  flags: 1, name: "nốt móc đơn", restName: "lặng móc đơn" }
};
const DEFAULT_DUR = 'q';

// What one item is worth, in quarter-note beats. A dot adds half again -
// that is the whole of what a dot means. Bar grouping, playback and the
// song tables all ask here, so a dotted note cannot be worth one thing in
// the bars and another in the ears.
function itemBeats(item) {
  const shape = DURATIONS[item.dur || DEFAULT_DUR] || DURATIONS[DEFAULT_DUR];
  return item.dot ? shape.beats * 1.5 : shape.beats;
}

// Fingering runs 1 (ngón cái) to 5 (ngón út) on each hand. Anything else is
// a mistake in the passage, not a number to draw.
const isFingerNumber = (n) => Number.isInteger(n) && n >= 1 && n <= 5;

// Fingering shown on the keys themselves - off unless asked for.
let keyFingering = {};

/* The two inks the notation is drawn in: everything the reader plays, and the
 * lines and bars it is written on. */
const INK = "#0f172a";
const STAFF_INK = "#64748b";

/* A label sits in a row above the staff. It shares that column with a finger
 * number, so it steps up when a note carries both. */
const LABEL_Y = 22;
function labelSvg(x, text, fingerY, seen) {
  const y = fingerY === null || fingerY === undefined ? LABEL_Y : Math.min(LABEL_Y, fingerY - 14);
  if (y !== LABEL_Y) seen(y - 9);
  return `<text x="${x}" y="${y}" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2563eb" text-anchor="middle">${text}</text>`;
}

// A rest has a duration but no pitch, so it sits at a spot fixed by
// convention rather than one derived from a note name. Coordinates are
// absolute (no group transform) so the viewBox fitter and the headless
// checks measure the real ink.
function restSvg(x, durKey, lineY1, lineSpacing, seen) {
  const mid = lineY1 - 4 * (lineSpacing / 2);                      // the middle line
  const half = lineSpacing / 2;

  if (durKey === "w" || durKey === "h") {
    // The whole rest hangs under line 4, the half rest sits on top of
    // line 3. They fill opposite halves of the same space - that is the
    // only thing telling the two apart, so it has to be exact.
    const top = durKey === "w" ? lineY1 - 6 * (lineSpacing / 2) : mid - half;
    seen(top); seen(top + half);
    return `<rect x="${x - 6}" y="${top}" width="12" height="${half}" fill="${INK}"/>`;
  }

  if (durKey === "e") {
    // One hook: a blob at the top left, a stroke slanting down to the left.
    seen(mid - 8); seen(mid + 8);
    return `<path d="M ${x + 3.5} ${mid - 8} L ${x - 2} ${mid + 8}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
         + `<path d="M ${x + 3.5} ${mid - 8} c -1.5 -1, -3.5 -0.5, -4.5 1.5" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`
         + `<circle cx="${x - 2.5}" cy="${mid - 5}" r="2.9" fill="${INK}"/>`;
  }

  // Quarter rest: a zigzag straddling the middle line.
  seen(mid - 10); seen(mid + 10);
  return `<path d="M ${x - 4} ${mid - 10} L ${x + 3} ${mid - 3} L ${x - 3} ${mid + 2.5} L ${x + 3} ${mid + 10}" `
       + `fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}


/* ---- Drawing one item on a staff -----------------------------------------
 * Pulled out of renderScoreSVG so a grand staff can put the same notes on a
 * second set of lines. `ctx` says where: the x of this slot, where the staff's
 * bottom line sits, which clef reads it, and the next item and its x, which a
 * tie needs to reach.
 *
 * It reports the vertical extent it touched rather than reaching into a
 * caller's viewBox fitter.
 */
function drawStaffItem(item, ctx) {
const { clef, lineY1, lineSpacing, topMargin } = ctx;
const noteX = ctx.x;
let svg = '';
let minY = Infinity, maxY = -Infinity;
const seen = (y) => { if (y < minY) minY = y; if (y > maxY) maxY = y; };

  // Silence takes up a slot in the bar exactly like a note does.
  if (item.rest) {
    if (item.finger !== undefined) {
      console.error('renderScoreSVG: a rest has no finger - the number was dropped.');
    }
    const restDur = item.dur || DEFAULT_DUR;
    if (!DURATIONS[restDur]) {
      console.error(`renderScoreSVG: unknown duration "${restDur}" on a rest - drawing a lặng đen.`);
    }
    svg += restSvg(noteX, DURATIONS[restDur] ? restDur : DEFAULT_DUR, lineY1, lineSpacing, seen);
    if (item.label) svg += labelSvg(noteX, item.label, null, seen);
    return { svg, minY, maxY };
  }

  // A chord is a stack of noteheads sharing one slot and one stem, so
  // everything below works on a list even when there is only one note in
  // it. `item.keys` gives the stack; `item.key` stays the single-note way.
  const stackKeys = Array.isArray(item.keys) ? item.keys : [item.key];
  const stack = [];
  for (const stackKey of stackKeys) {
    const found = notesData[clef].find(n => n.key === stackKey);
    if (!found) {
      // Never guess a position: a wrong notehead teaches the wrong thing.
      console.error(`renderScoreSVG: no "${clef}" entry for key "${stackKey}" - skipped.`);
      continue;
    }
    stack.push(found);
  }
  if (stack.length === 0) return { svg, minY, maxY };
  stack.sort((a, b) => a.step - b.step);

  // Spelling a sharp as a flat moves it onto the letter above: C# sits on
  // the C line, Db on the D line. Same key, different place on the staff.
  const spellFlat = item.spell === 'flat';
  if (spellFlat && !stack.every(n => n.acc)) {
    console.error(`renderScoreSVG: "${item.key}" has no sharp to respell as a flat.`);
  }
  const useFlat = spellFlat && stack.every(n => n.acc);

  const steps = stack.map(n => (useFlat ? flatSpelledStep(n.step) : n.step));
  const lowStep = steps[0], highStep = steps[steps.length - 1];
  const yOfStep = (s) => lineY1 - s * (lineSpacing / 2);
  const noteY = yOfStep(highStep);      // top of the stack, for the finger row

  // The stack as a whole decides the stem direction. For one note this is
  // the old rule, `step <= 4`, unchanged.
  const stemUp = (lowStep + highStep) / 2 <= 4;

  // Two notes a second apart cannot share a column, so the upper one of
  // each pair moves to the far side of the stem.
  const shifted = [];
  for (let i = 0; i < steps.length; i++) {
    shifted.push(i > 0 && steps[i] - steps[i - 1] === 1 && !shifted[i - 1]);
  }

  // Ledger lines belong to the stack, not to each note: two notes below
  // the staff cross the same lines, and drawing them twice thickens them.
  const ledgerSteps = [];
  for (const s of steps) {
    if (s <= -2) {
      for (let l = -2; l >= s; l -= 2) if (!ledgerSteps.includes(l)) ledgerSteps.push(l);
    } else if (s >= 10) {
      for (let u = 10; u <= s; u += 2) if (!ledgerSteps.includes(u)) ledgerSteps.push(u);
    }
  }
  for (const l of ledgerSteps) {
    const ledgerY = yOfStep(l);
    seen(ledgerY);
    svg += `<line x1="${noteX - 13}" y1="${ledgerY}" x2="${noteX + 13}" y2="${ledgerY}" stroke="#334155" stroke-width="1.5"/>`;
  }

  // Accidentals stack leftwards, top note first, so they do not collide.
  let accSlot = 0;
  for (let i = stack.length - 1; i >= 0; i--) {
    const accChar = useFlat ? '♭' : ((stack.length === 1 ? item.acc : null) || stack[i].acc);
    if (!accChar) continue;
    svg += `<text x="${noteX - 16 - accSlot * 11}" y="${yOfStep(steps[i]) + 4}" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">${accChar}</text>`;
    accSlot++;
  }

  // Duration drives the notehead shape, the stem and any flags.
  const durKey = item.dur || DEFAULT_DUR;
  const dur = DURATIONS[durKey];
  if (!dur) {
    console.error(`renderScoreSVG: unknown duration "${durKey}" on "${item.key}" - drawing a quarter note.`);
  }
  const shape = dur || DURATIONS[DEFAULT_DUR];

  // Draw Notehead: hollow for whole/half, filled for quarter/eighth.
  // The whole note is wider and sits upright; the rest lean like handwriting.
  for (let i = 0; i < stack.length; i++) {
    const headY = yOfStep(steps[i]);
    const headX = shifted[i] ? noteX + (stemUp ? 11 : -11) : noteX;
    seen(headY);
    // `item.highlight` colours the head without changing its shape, so the
    // learner can see which note is being waited for without the notation
    // itself saying something different.
    const headInk = item.highlight ? '#2563eb' : '#0f172a';
    if (shape.hollow && !shape.stem) {
      svg += `<ellipse cx="${headX}" cy="${headY}" rx="7" ry="4.8" fill="none" stroke="${headInk}" stroke-width="1.8"/>`;
    } else {
      const fill = shape.hollow
        ? `fill="none" stroke="${headInk}" stroke-width="1.6"`
        : `fill="${headInk}"`;
      svg += `<g transform="translate(${headX}, ${headY}) rotate(-20)">
                    <ellipse cx="0" cy="0" rx="6" ry="4.5" ${fill} />
                  </g>`;
    }
  }

  // The dot goes to the right of the notehead. A note sitting on a line
  // has no room there, so its dot moves up into the space above - which
  // is where an engraver puts it too.
  if (item.dot) {
    for (let i = 0; i < stack.length; i++) {
      const onLine = steps[i] % 2 === 0;
      const dotY = yOfStep(steps[i]) - (onLine ? lineSpacing / 2 : 0);
      seen(dotY);
      svg += `<circle cx="${noteX + 12}" cy="${dotY}" r="2.2" fill="${INK}"/>`;
    }
  }

  // Draw Stem (down if the note sits high on the staff, up if low). It
  // runs from the notehead at one end of the stack to past the other.
  if (shape.stem) {
    const dir = stemUp ? -1 : 1;              // -1 draws upward on screen
    const stemX = noteX + (stemUp ? 5.5 : -5.5);
    const anchorY = stemUp ? yOfStep(lowStep) : yOfStep(highStep);
    const stemY2 = (stemUp ? yOfStep(highStep) : yOfStep(lowStep)) + dir * 26;
    seen(stemY2);
    svg += `<line x1="${stemX}" y1="${anchorY}" x2="${stemX}" y2="${stemY2}" stroke="#0f172a" stroke-width="1.5"/>`;

    // Draw flags. A flag hangs from the stem tip and sweeps back toward
    // the notehead - so it runs opposite the stem, never past the tip.
    const flagDir = -dir;
    for (let f = 0; f < shape.flags; f++) {
      const tipY = stemY2 + flagDir * f * 7;
      svg += `<path d="M ${stemX} ${tipY} `
           + `c 7 ${flagDir * 3}, 10 ${flagDir * 9}, 7 ${flagDir * 16} `
           + `c 1 ${flagDir * -7}, -3 ${flagDir * -11}, -7 ${flagDir * -13} z" fill="#0f172a"/>`;
    }
  }

  // A tie joins this note to the next one at the same pitch: they sound
  // as one longer note. A curve between two different pitches is a slur,
  // which means something else entirely, so that is refused.
  if (item.tie) {
    const next = ctx.nextItem;
    if (!next) {
      console.error('renderScoreSVG: the last note is tied to nothing.');
    } else if (next.rest) {
      console.error('renderScoreSVG: a note cannot be tied to a rest.');
    } else if ((next.key || (next.keys || [])[0]) !== (item.key || stackKeys[0])) {
      console.error(`renderScoreSVG: "${item.key}" is tied to "${next.key}" - a tie joins the same pitch, a curve between different ones is a slur.`);
    } else {
      const tieY = yOfStep(lowStep);
      const bow = stemUp ? 12 : -12;         // arc away from the stems
      const endX = ctx.nextX;
      seen(tieY + bow);
      svg += `<path d="M ${noteX + 7} ${tieY + (stemUp ? 4 : -4)} `
           + `Q ${(noteX + endX) / 2} ${tieY + bow}, ${endX - 7} ${tieY + (stemUp ? 4 : -4)}" `
           + `fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
    }
  }

  // Fingering is printed as a row above the staff, the way piano method
  // books set it, and only climbs higher for a note that already sits
  // above that row. Hugging each notehead instead would put the number
  // in among the ledger lines of anything far below the staff - at C2 it
  // landed squarely on top of them.
  //
  // Only the notehead is worth measuring here. A stem pointing up belongs
  // to a note on or below the middle line, which is always well below the
  // row, so the stem tip can never be the thing the number has to clear.
  let fingerY = null;
  if (item.finger !== undefined) {
    if (!isFingerNumber(item.finger)) {
      console.error(`renderScoreSVG: finger "${item.finger}" on "${item.key}" is not 1-5 - skipped.`);
    } else {
      fingerY = Math.min(topMargin - 8, noteY - 13);
      seen(fingerY - 9);
      svg += `<text x="${noteX}" y="${fingerY}" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#7c3aed" text-anchor="middle">${item.finger}</text>`;
    }
  }

  // Draw Annotation Label if provided
  if (item.label) svg += labelSvg(noteX, item.label, fingerY, seen);
return { svg, minY, maxY };
}


// Generalized SVG Pure Renderer Function
function renderScoreSVG(containerId, notesArray, clef = 'treble', width = 360, height = 160, timeSig = null, keySig = null, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const lineSpacing = 10;
  const topMargin = 50;
  const lineY1 = topMargin + 4 * lineSpacing; // Bottom line (Line 1)
  const yAtStep = (s) => lineY1 - s * (lineSpacing / 2);

  // Time signature, written "phách/đơn-vị" as in "3/4". Leaving it out means
  // a bare staff with no bars - what every caller written before T3 expects,
  // so nothing about the layout may shift unless one is actually asked for.
  let meter = null;
  if (timeSig !== null && timeSig !== undefined) {
    const sig = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(timeSig));
    const top = sig && Number(sig[1]), bottom = sig && Number(sig[2]);
    if (!sig || top < 1 || bottom < 1) {
      console.error(`renderScoreSVG: unreadable time signature "${timeSig}" - drawing without one.`);
    } else {
      // DURATIONS.beats counts quarter notes, so convert the bar capacity into
      // that same unit: 3/4 holds 3 quarters, 6/8 holds 3, 2/2 holds 4.
      meter = { top, bottom, capacity: top * 4 / bottom };
    }
  }

  // Key signature accidentals sit between the clef and the time signature.
  const keyMarks = keySig ? (keySignatureMarks(keySig, clef) || []) : [];
  const keyWidth = keyMarks.length * 9;

  // A passage broken across several lines states its meter once, on the first
  // line, the way printed music does - but every line still needs its bars.
  const showMeterNumerals = Boolean(meter) && !opts.hideMeterNumerals;
  const startX = (showMeterNumerals ? 92 : 65) + keyWidth;
  
  // Vertical extent actually drawn; the viewBox is fitted to it at the end so
  // notes far above/below the staff (C2, C6) stay visible instead of clipping.
  let minY = topMargin, maxY = lineY1;
  const seen = (y) => { if (y < minY) minY = y; if (y > maxY) maxY = y; };
  let svg = '';

  // Draw 5 Staff Lines
  for (let i = 0; i < 5; i++) {
    const y = topMargin + i * lineSpacing;
    svg += `<line x1="15" y1="${y}" x2="${width - 15}" y2="${y}" stroke="#64748b" stroke-width="1.5"/>`;
  }

  // Draw Start/End vertical barlines
  svg += `<line x1="15" y1="${topMargin}" x2="15" y2="${lineY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;
  if (meter) {
    // A metered passage ends on a double bar: thin, then thick.
    svg += `<line x1="${width - 21}" y1="${topMargin}" x2="${width - 21}" y2="${lineY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;
    svg += `<line x1="${width - 15}" y1="${topMargin}" x2="${width - 15}" y2="${lineY1}" stroke="${STAFF_INK}" stroke-width="5"/>`;
  } else {
    svg += `<line x1="${width - 15}" y1="${topMargin}" x2="${width - 15}" y2="${lineY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;
  }

  keyMarks.forEach((mark, i) => {
    const y = yAtStep(mark.step);
    seen(y - 6); seen(y + 6);
    svg += `<text x="${50 + i * 9}" y="${y + 4}" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">${mark.glyph}</text>`;
  });

  // The numerals stack up after the clef: the count centred between lines 3
  // and 5, the unit between lines 1 and 3.
  if (showMeterNumerals) {
    const sigAttrs = `font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="${INK}" text-anchor="middle" dominant-baseline="central"`;
    svg += `<text x="${66 + keyWidth}" y="${yAtStep(6)}" ${sigAttrs}>${meter.top}</text>`;
    svg += `<text x="${66 + keyWidth}" y="${yAtStep(2)}" ${sigAttrs}>${meter.bottom}</text>`;
  }

  // Draw Clef Symbol (Vector SVG for Treble and Bass)
  if (clef === 'treble') {
    svg += `<text x="20" y="${topMargin + 32}" font-family="serif, 'Segoe UI Symbol', sans-serif" font-size="40" fill="#0f172a" font-weight="bold">🎼</text>`;
  } else {
    svg += `<g transform="translate(22, ${topMargin + 5})">
                  <path d="M 6 12 C 6 6 13 4 15 10 C 16 13 13 18 8 18 C 3 18 1 13 1 8 C 1 2 9 0 16 3 C 21 6 22 13 20 20 C 17 28 8 33 2 35" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
                  <circle cx="25" cy="6" r="2.5" fill="#0f172a"/>
                  <circle cx="25" cy="16" r="2.5" fill="#0f172a"/>
                </g>`;
  }

  const LABEL_Y = 22;
  // labelSvg, restSvg and the item drawing now live at module scope.
  // Draw Notes with Dynamic Ledger Lines
  const totalNotes = notesArray.length;
  const availWidth = width - startX - 35;
  const noteSpacing = totalNotes > 1 ? availWidth / (totalNotes - 0.5) : availWidth / 2;
  const xOf = (idx) => startX + idx * noteSpacing + 20;

  // Fill one bar at a time until it is full, then start the next. A bar that
  // does not add up is a mistake in the passage, not something to paper
  // over, so it gets reported instead of quietly redrawn.
  const barlineBefore = new Set();
  if (meter && totalNotes) {
    const bars = [];
    let bar = { start: 0, beats: 0 };
    notesArray.forEach((item, idx) => {
      if (bar.beats >= meter.capacity - 1e-9) { bars.push(bar); bar = { start: idx, beats: 0 }; }
      bar.beats += itemBeats(item);
    });
    bars.push(bar);

    bars.forEach((b, i) => {
      if (i > 0) barlineBefore.add(b.start);
      if (Math.abs(b.beats - meter.capacity) > 1e-9) {
        console.warn(`renderScoreSVG: ô nhịp ${i + 1} có ${b.beats} phách, nhịp ${meter.top}/${meter.bottom} cần ${meter.capacity}.`);
      }
    });

    // Halfway between the two notes it separates.
    barlineBefore.forEach((idx) => {
      const bx = (xOf(idx - 1) + xOf(idx)) / 2;
      svg += `<line x1="${bx}" y1="${topMargin}" x2="${bx}" y2="${lineY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;
    });
  }

  notesArray.forEach((item, idx) => {
    const drawn = drawStaffItem(item, {
      x: xOf(idx), lineY1, lineSpacing, topMargin, clef,
      nextItem: notesArray[idx + 1], nextX: xOf(idx + 1),
    });
    svg += drawn.svg;
    if (drawn.minY < Infinity) { seen(drawn.minY); seen(drawn.maxY); }
  });
  const vbTop = Math.min(0, minY - 14);
  const vbBottom = Math.max(height, maxY + 14);
  container.innerHTML = `<svg width="${width}" height="${height}" viewBox="0 ${vbTop} ${width} ${vbBottom - vbTop}" `
    + `preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="select-none">`
    + svg + `</svg>`;
}

/* How much of the keyboard to show. The full instrument is 29 white keys
 * wide, which no phone can hold without scrolling sideways; two octaves
 * fits, and is all a beginner needs at once. */
const KEYBOARD_RANGES = {
  full: { label: 'Toàn bộ · C2–C6', from: 'c/2', to: 'c/6' },
  two:  { label: '2 quãng tám · C3–C5', from: 'c/3', to: 'c/5' },
};
let keyboardRange = 'full';

function visibleKeyboardKeys() {
  const range = KEYBOARD_RANGES[keyboardRange];
  const from = keyboardKeys.findIndex(k => k.key === range.from);
  const to = keyboardKeys.findIndex(k => k.key === range.to);
  return keyboardKeys.slice(from, to + 1);
}

function setKeyboardRange(range) {
  if (!KEYBOARD_RANGES[range]) {
    console.error(`setKeyboardRange: there is no keyboard range called "${range}".`);
    return false;
  }
  keyboardRange = range;
  buildPianoKeyboard();
  for (const name of Object.keys(KEYBOARD_RANGES)) {
    const btn = document.getElementById(`range-btn-${name}`);
    if (btn) {
      btn.className = name === range
        ? 'px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm transition-all'
        : 'px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all';
    }
  }
  return true;
}

// Render Piano Keyboard Elements
function buildPianoKeyboard() {
  const keyboardEl = document.getElementById('keyboard-element');
  if (!keyboardEl) return;

  let html = '';
  const fingerBadge = (k) => keyFingering[k.key]
    ? `<span class="key-finger pointer-events-none">${keyFingering[k.key]}</span>`
    : '';

  // Every key is reachable and announces itself: the keyboard is the whole
  // interface here, so leaving it as unlabelled divs shuts people out of it.
  const aria = (k) => `role="button" tabindex="0" aria-label="Nốt ${k.noteName}"`;

  // A black key sits at the boundary after the white keys before it, so its
  // place is worked out from what is on screen rather than stored - which
  // is what lets a shorter keyboard and a narrower key still line up.
  let whitesSoFar = 0;

  visibleKeyboardKeys().forEach((k) => {
    if (k.type === 'white') whitesSoFar++;
    if (k.type === 'white') {
      html += `<div class="white-key" id="key-${k.key.replace('/', '_')}" ${aria(k)} onclick="handleKeyClick('${k.key}')">
                ${fingerBadge(k)}<span class="text-xs font-bold pointer-events-none">${k.name}</span>
                <span class="key-sub text-[10px] text-slate-400 font-medium pointer-events-none">${k.noteName}</span>
              </div>`;
    } else {
      html += `<div class="black-key" id="key-${k.key.replace('/', '_')}" ${aria(k)} style="left: calc(var(--white-key-w) * ${whitesSoFar});" onclick="handleKeyClick('${k.key}')">${fingerBadge(k)}</div>`;
    }
  });

  keyboardEl.innerHTML = html;
}

// Show fingering on the keys themselves: pass { "c/4": 1, "d/4": 2 }.
// The map is stored and the keyboard redrawn from it, so the markup has one
// source rather than badges being poked into the DOM after the fact.
function setKeyFingering(mapping) {
  const next = {};
  Object.entries(mapping || {}).forEach(([key, finger]) => {
    if (!isFingerNumber(finger)) {
      console.error(`setKeyFingering: finger "${finger}" on "${key}" is not 1-5 - skipped.`);
      return;
    }
    if (!keyboardKeys.some((k) => k.key === key)) {
      console.error(`setKeyFingering: no key "${key}" on the keyboard - skipped.`);
      return;
    }
    next[key] = finger;
  });
  keyFingering = next;
  buildPianoKeyboard();
}

function clearKeyFingering() {
  setKeyFingering({});
}

// Scroll keyboard to specific octave position
function scrollKeyboardTo(noteNamePrefix) {
  // ids are built as `key-<letter>_<octave>` (see buildPianoKeyboard)
  const letter = noteNamePrefix.slice(0, -1).toLowerCase();
  const octave = noteNamePrefix.slice(-1);
  const targetEl = document.getElementById(`key-${letter}_${octave}`);
  const container = document.getElementById('keyboard-scroll-container');
  if (targetEl && container) {
    container.scrollTo({
      left: targetEl.offsetLeft - 40,
      behavior: 'smooth'
    });
  }
}

// Web Audio Synthesizer Engine
//
// Everything that makes a sound goes through one chain:
//   oscillator -> per-note ADSR gain -> limiter -> master gain -> speakers
// Nothing connects to ctx.destination directly. That is what keeps a chord
// from adding its voices together past full scale.
function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterLimiter = audioCtx.createDynamicsCompressor();
    masterLimiter.threshold.setValueAtTime(-8, audioCtx.currentTime);
    masterLimiter.ratio.setValueAtTime(12, audioCtx.currentTime);
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    masterLimiter.connect(masterGain);
    masterGain.connect(audioCtx.destination);
  }
  // A context created before the first gesture starts out suspended and
  // stays silent until something resumes it.
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Cut a note that is still sounding, quickly but not instantly - snapping the
// gain straight to zero clicks.
function releaseVoice(voiceId, when) {
  const voice = activeVoices.get(voiceId);
  if (!voice) return;
  activeVoices.delete(voiceId);
  const at = Math.max(when, audioCtx.currentTime);
  try {
    voice.gain.gain.cancelScheduledValues(at);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, SILENT), at);
    voice.gain.gain.exponentialRampToValueAtTime(SILENT, at + 0.03);
    voice.osc.stop(at + 0.05);
  } catch (e) {
    // The oscillator had already finished on its own; nothing to cut.
  }
}

// opts.at    - when to start, in AudioContext time (default: now)
// opts.hold  - seconds to hold before the release begins
// opts.voice - an id, so striking the same key again cuts the note it left
//              ringing instead of stacking a second one on top of it
function playTone(freq, opts = {}) {
  if (!freq) return null;
  try {
    const ctx = ensureAudio();
    const at = opts.at === undefined ? ctx.currentTime : opts.at;
    const hold = opts.hold === undefined ? 1.0 : opts.hold;
    const voiceId = opts.voice === undefined ? null : opts.voice;

    if (voiceId !== null) releaseVoice(voiceId, at);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // The chosen voice supplies both the waveform and the envelope.
    const timbre = VOICES[currentVoice] || VOICES.organ;
    osc.type = timbre.wave;
    osc.frequency.setValueAtTime(freq, at);

    const { attack, decay, sustain, release } = timbre;
    const sustainLevel = Math.max(VOICE_PEAK * sustain, SILENT);
    const releaseAt = at + Math.max(hold, attack + decay);
    const endAt = releaseAt + release;

    const g = gain.gain;
    g.setValueAtTime(SILENT, at);
    g.exponentialRampToValueAtTime(VOICE_PEAK, at + attack);
    g.exponentialRampToValueAtTime(sustainLevel, at + attack + decay);
    g.setValueAtTime(sustainLevel, releaseAt);
    g.exponentialRampToValueAtTime(SILENT, endAt);

    osc.connect(gain);
    gain.connect(masterLimiter);

    osc.start(at);
    osc.stop(endAt + 0.02);

    if (voiceId !== null) {
      const voice = { osc, gain };
      activeVoices.set(voiceId, voice);
      osc.onended = () => { if (activeVoices.get(voiceId) === voice) activeVoices.delete(voiceId); };
    }
    return { osc, gain, startsAt: at, endsAt: endAt };
  } catch (e) {
    console.error("Audio Playback Error:", e);
    return null;
  }
}

/* ---- Metronome -------------------------------------------------------
 * The classic Web Audio metronome: a coarse timer wakes up often enough to
 * look a little way ahead, and every click is scheduled against
 * AudioContext.currentTime. The timer only decides *when to think*; it
 * never decides when a click sounds, because setInterval drifts and the
 * audio clock does not.
 */
const METRONOME_BPM = { min: 40, max: 208 };
const LOOKAHEAD_MS = 25;        // how often to wake up
const SCHEDULE_AHEAD = 0.12;    // how far ahead to schedule, in seconds

const metronome = { running: false, bpm: 90, beatsPerBar: 4, nextBeatTime: 0, beat: 0, timer: null, frame: null };
const metronomeQueue = [];      // clicks already scheduled, for the beat light

function setMetronomeBpm(bpm) {
  if (!Number.isFinite(bpm) || bpm < METRONOME_BPM.min || bpm > METRONOME_BPM.max) {
    console.error(`setMetronomeBpm: ${bpm} is outside ${METRONOME_BPM.min}-${METRONOME_BPM.max} BPM - ignored.`);
    return false;
  }
  metronome.bpm = bpm;
  const label = document.getElementById('metronome-bpm-value');
  if (label) label.innerText = `${bpm} BPM`;
  return true;
}

function setMetronomeBeatsPerBar(beats) {
  if (!Number.isInteger(beats) || beats < 2 || beats > 12) {
    console.error(`setMetronomeBeatsPerBar: ${beats} is not a bar length between 2 and 12 - ignored.`);
    return false;
  }
  metronome.beatsPerBar = beats;
  metronome.beat = 0;
  buildBeatLights();
  return true;
}

// The first beat of the bar is higher and louder - that accent is the whole
// point of counting along to it.
function scheduleClick(beatIndex, at) {
  const ctx = ensureAudio();
  const accent = beatIndex === 0;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(accent ? 1600 : 1000, at);

  const peak = accent ? 0.26 : 0.15;
  gain.gain.setValueAtTime(SILENT, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.002);
  gain.gain.exponentialRampToValueAtTime(SILENT, at + 0.045);

  osc.connect(gain);
  gain.connect(masterLimiter);
  osc.start(at);
  osc.stop(at + 0.06);

  metronomeQueue.push({ beat: beatIndex, at });
}

function metronomeScheduler() {
  if (!metronome.running) return;
  const ctx = ensureAudio();
  while (metronome.nextBeatTime < ctx.currentTime + SCHEDULE_AHEAD) {
    scheduleClick(metronome.beat, metronome.nextBeatTime);
    metronome.nextBeatTime += 60 / metronome.bpm;
    metronome.beat = (metronome.beat + 1) % metronome.beatsPerBar;
  }
}

// Which beat should be lit at `now`. Drains everything already due, so a
// frame that arrives late lights the most recent beat rather than replaying
// the backlog one frame at a time.
function metronomeBeatAt(now) {
  let current = null;
  while (metronomeQueue.length && metronomeQueue[0].at <= now) current = metronomeQueue.shift();
  return current === null ? null : current.beat;
}

function startMetronome() {
  if (metronome.running) return;
  const ctx = ensureAudio();
  metronome.running = true;
  metronome.beat = 0;
  metronomeQueue.length = 0;
  metronome.nextBeatTime = ctx.currentTime + 0.08;   // a beat of headroom
  metronomeScheduler();
  metronome.timer = setInterval(metronomeScheduler, LOOKAHEAD_MS);
  if (typeof requestAnimationFrame === 'function') metronomeFrame();
  const btn = document.getElementById('metronome-toggle');
  if (btn) btn.innerText = 'Dừng';
}

function stopMetronome() {
  if (metronome.timer !== null) clearInterval(metronome.timer);
  if (metronome.frame !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(metronome.frame);
  metronome.timer = null;
  metronome.frame = null;
  metronome.running = false;
  metronomeQueue.length = 0;
  lightBeat(null);
  const btn = document.getElementById('metronome-toggle');
  if (btn) btn.innerText = 'Bắt đầu';
}

function toggleMetronome() {
  if (metronome.running) stopMetronome(); else startMetronome();
}

function metronomeFrame() {
  if (!metronome.running) return;
  const beat = metronomeBeatAt(audioCtx.currentTime);
  if (beat !== null) lightBeat(beat);
  metronome.frame = requestAnimationFrame(metronomeFrame);
}

/* ---- Playing a passage in time ---------------------------------------
 * Same rule as the metronome: the timer only wakes us up, every note is
 * scheduled against AudioContext.currentTime.
 */
const PLAYBACK_BPM = { min: 30, max: 200 };
const player = {
  playing: false, items: [], clef: 'treble', bpm: 90, loop: false,
  from: 0, to: 0, cursor: 0, schedule: [], queue: [], endsAt: 0, timer: null,
};

// Absolute times for a passage. Deliberately pure - no audio, no DOM. The
// timing is the part worth checking, and it is only checkable on its own.
function sequenceSchedule(items, bpm, startAt) {
  const secPerBeat = 60 / bpm;
  let at = startAt;
  return items.map((item, index) => {
    const beats = itemBeats(item);
    const entry = { index, item, at, seconds: beats * secPerBeat };
    at += entry.seconds;
    return entry;
  });
}

function setPlaybackBpm(bpm) {
  if (!Number.isFinite(bpm) || bpm < PLAYBACK_BPM.min || bpm > PLAYBACK_BPM.max) {
    console.error(`setPlaybackBpm: ${bpm} is outside ${PLAYBACK_BPM.min}-${PLAYBACK_BPM.max} BPM - ignored.`);
    return false;
  }
  player.bpm = bpm;
  const label = document.getElementById('player-bpm-value');
  if (label) label.innerText = `${bpm} BPM`;
  return true;
}

// Lay down every note from `fromIndex` to the end of the phrase.
function schedulePhraseFrom(fromIndex) {
  const ctx = ensureAudio();
  const slice = player.items.slice(fromIndex, player.to + 1);
  const schedule = sequenceSchedule(slice, player.bpm, ctx.currentTime + 0.1);

  player.schedule = schedule.map(e => ({ ...e, index: e.index + fromIndex }));
  player.queue = [];

  // A tied note and the one it is tied to are a single sound. Roll the
  // second one's length into the first and let it pass in silence, rather
  // than re-striking the same pitch in the middle of a held note.
  const tiedInto = new Set();
  player.schedule.forEach((entry, i) => {
    if (tiedInto.has(entry.index)) return;      // already rolled into an earlier note
    let j = i;
    while (player.schedule[j].item.tie) {
      const next = player.schedule[j + 1];
      if (!next || next.item.rest || next.item.key !== player.schedule[j].item.key) break;
      entry.seconds += next.seconds;
      tiedInto.add(next.index);
      j++;
    }
  });

  for (const entry of player.schedule) {
    if (entry.item.rest || tiedInto.has(entry.index)) { player.queue.push({ index: entry.index, at: entry.at, key: null }); continue; }
    const note = notesData[player.clef].find(n => n.key === entry.item.key);
    if (!note) {
      // Same rule as the staff: refuse to guess. The silence is audible,
      // which is the point - a wrong note would not be.
      console.error(`playSequence: no "${player.clef}" entry for key "${entry.item.key}" - skipped.`);
      player.queue.push({ index: entry.index, at: entry.at, key: null });
      continue;
    }
    // Stop just short of the next note so repeated pitches re-articulate.
    playTone(note.freq, { at: entry.at, hold: entry.seconds * 0.92, voice: `seq-${entry.index}` });
    player.queue.push({ index: entry.index, at: entry.at, key: entry.item.key });
  }

  // A tie lengthens a note by exactly the length of the one it swallows, so
  // it finishes where that note would have finished. The last entry is
  // therefore still the furthest, tie or no tie.
  const last = player.schedule[player.schedule.length - 1];
  player.endsAt = last ? last.at + last.seconds : ctx.currentTime;
}

function silenceSequenceVoices() {
  for (const id of Array.from(activeVoices.keys())) {
    if (String(id).startsWith('seq-')) releaseVoice(id, audioCtx ? audioCtx.currentTime : 0);
  }
}

function playerTick() {
  if (!player.playing) return;
  const now = ensureAudio().currentTime;

  let lit;
  while (player.queue.length && player.queue[0].at <= now) lit = player.queue.shift();
  if (lit !== undefined) {
    player.cursor = lit.index;
    setPlaybackHighlight(lit.key);
  }

  if (now >= player.endsAt) {
    if (player.loop) {
      player.cursor = player.from;
      schedulePhraseFrom(player.from);
    } else {
      stopSequence();
    }
  }
}

function playSequence(items, opts = {}) {
  stopSequence();
  if (!Array.isArray(items) || items.length === 0) {
    console.error('playSequence: there is nothing to play.');
    return false;
  }
  if (opts.bpm !== undefined && !setPlaybackBpm(opts.bpm)) return false;

  const from = opts.from === undefined ? 0 : opts.from;
  const to = opts.to === undefined ? items.length - 1 : opts.to;
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to >= items.length || from > to) {
    console.error(`playSequence: ${from}-${to} is not a phrase inside a passage of ${items.length} - ignored.`);
    return false;
  }

  player.items = items;
  player.clef = opts.clef || player.clef;
  player.loop = Boolean(opts.loop);
  player.from = from;
  player.to = to;
  player.cursor = from;
  player.playing = true;

  schedulePhraseFrom(from);
  player.timer = setInterval(playerTick, 25);
  setPlayerButtons();
  return true;
}

// Pausing has to silence what is already scheduled: those notes are sitting
// in the audio clock's future and will sound whatever the UI thinks.
function pauseSequence() {
  if (!player.playing) return false;
  const now = ensureAudio().currentTime;
  const sounding = player.schedule.filter(e => e.at <= now).pop();
  player.cursor = sounding ? sounding.index : player.from;
  player.playing = false;
  if (player.timer !== null) clearInterval(player.timer);
  player.timer = null;
  silenceSequenceVoices();
  player.queue = [];
  setPlaybackHighlight(null);
  setPlayerButtons();
  return true;
}

function resumeSequence() {
  if (player.playing || !player.items.length) return false;
  player.playing = true;
  schedulePhraseFrom(player.cursor);
  player.timer = setInterval(playerTick, 25);
  setPlayerButtons();
  return true;
}

function stopSequence() {
  if (player.timer !== null) clearInterval(player.timer);
  player.timer = null;
  player.playing = false;
  player.queue = [];
  player.schedule = [];
  player.cursor = player.from;
  silenceSequenceVoices();
  setPlaybackHighlight(null);
  setPlayerButtons();
}

function setPlaybackHighlight(key) {
  document.querySelectorAll('.white-key, .black-key').forEach(el => el.classList.remove('active'));
  if (!key) return;
  const el = document.getElementById(`key-${key.replace('/', '_')}`);
  if (el) el.classList.add('active');
}

function setPlayerButtons() {
  const btn = document.getElementById('player-toggle');
  if (btn) btn.innerText = player.playing ? 'Tạm dừng' : 'Phát';
}

/* ---- Left-hand chords -------------------------------------------------
 * The seven chords a beginner needs to accompany anything in C major.
 * Written in octave 3, where the left hand sits on this keyboard, and in
 * root position - inversions are derived rather than written out, so there
 * is one place a wrong note could hide instead of three.
 */
const CHORDS = {
  C:  { label: 'Đô trưởng',  notes: ['c/3', 'e/3', 'g/3'] },
  Dm: { label: 'Rê thứ',     notes: ['d/3', 'f/3', 'a/3'] },
  Em: { label: 'Mi thứ',     notes: ['e/3', 'g/3', 'b/3'] },
  F:  { label: 'Fa trưởng',  notes: ['f/3', 'a/3', 'c/4'] },
  G:  { label: 'Sol trưởng', notes: ['g/3', 'b/3', 'd/4'] },
  G7: { label: 'Sol bảy',    notes: ['g/3', 'b/3', 'd/4', 'f/4'] },
  Am: { label: 'La thứ',     notes: ['a/3', 'c/4', 'e/4'] },
};

let chordInversion = 0;      // which of the three basic positions to play
let chordBroken = false;     // block chord, or spread out like an arpeggio

const PROGRESSIONS = [
  { name: 'C – G – Am – F', chords: ['C', 'G', 'Am', 'F'] },
  { name: 'C – Am – F – G', chords: ['C', 'Am', 'F', 'G'] },
];

function raiseOctave(key) {
  const cut = key.lastIndexOf('/');
  return `${key.slice(0, cut)}/${Number(key.slice(cut + 1)) + 1}`;
}

// Inversion 0 is root position; each one after that lifts the lowest note
// up an octave. Returns null rather than a plausible-looking wrong chord.
function chordVoicing(chordId, inversion = 0) {
  const chord = CHORDS[chordId];
  if (!chord) {
    console.error(`chordVoicing: no chord called "${chordId}".`);
    return null;
  }
  if (!Number.isInteger(inversion) || inversion < 0 || inversion >= chord.notes.length) {
    console.error(`chordVoicing: ${chordId} has no inversion ${inversion} - it has ${chord.notes.length} notes.`);
    return null;
  }
  const notes = chord.notes.slice();
  for (let i = 0; i < inversion; i++) {
    const raised = raiseOctave(notes.shift());
    if (!keyboardKeys.some(k => k.key === raised)) {
      console.error(`chordVoicing: ${chordId} inversion ${inversion} needs "${raised}", which is off the keyboard.`);
      return null;
    }
    notes.push(raised);
  }
  return notes;
}

// Block: every note together. Broken: spread out like a left-hand arpeggio.
function playChord(chordId, opts = {}) {
  const notes = chordVoicing(chordId, opts.inversion === undefined ? 0 : opts.inversion);
  if (!notes) return false;

  const ctx = ensureAudio();
  const at = ctx.currentTime + 0.05;
  const spread = opts.broken ? 60 / player.bpm / 2 : 0;   // an eighth note apart

  notes.forEach((key, i) => {
    const note = notesData.bass.find(n => n.key === key);
    if (!note) {
      console.error(`playChord: no bass entry for "${key}" - skipped.`);
      return;
    }
    playTone(note.freq, { at: at + i * spread, hold: 1.4 - i * spread, voice: `chord-${key}` });
  });

  showChordOnStaff(chordId, notes);
  lightChordKeys(notes);
  return true;
}

function showChordOnStaff(chordId, notes) {
  renderScoreSVG('chord-score', [{ keys: notes, dur: 'w', label: chordId }], 'bass', 360, 170);
  const caption = document.getElementById('chord-caption');
  if (caption) caption.innerText = `${chordId} — ${CHORDS[chordId].label}`;
}

function lightChordKeys(notes) {
  document.querySelectorAll('.white-key, .black-key').forEach(el => el.classList.remove('active'));
  for (const key of notes) {
    const el = document.getElementById(`key-${key.replace('/', '_')}`);
    if (el) el.classList.add('active');
  }
}

function setChordInversion(inversion) {
  if (!Number.isInteger(inversion) || inversion < 0 || inversion > 2) {
    console.error(`setChordInversion: ${inversion} is not one of the three basic positions.`);
    return false;
  }
  chordInversion = inversion;
  return true;
}

function pickChord(chordId) {
  playChord(chordId, { inversion: chordInversion, broken: chordBroken });
}

// Walk a progression, one chord to the bar, using the playback tempo.
function playProgression(index) {
  const progression = PROGRESSIONS[index];
  if (!progression) {
    console.error(`playProgression: there is no progression ${index}.`);
    return false;
  }
  const ctx = ensureAudio();
  const secPerBar = (60 / player.bpm) * 4;
  progression.chords.forEach((chordId, i) => {
    const notes = chordVoicing(chordId, 0);
    if (!notes) return;
    for (const key of notes) {
      const note = notesData.bass.find(n => n.key === key);
      if (note) playTone(note.freq, { at: ctx.currentTime + 0.05 + i * secPerBar, hold: secPerBar * 0.9, voice: `prog-${i}-${key}` });
    }
  });
  const caption = document.getElementById('chord-caption');
  if (caption) caption.innerText = `Vòng hợp âm ${progression.name}`;
  return true;
}

/* ---- The lesson path --------------------------------------------------
 * Ten numbered lessons, each theory then practice then a check. The
 * practice step always hands the learner to a part of the app that
 * already exists rather than reimplementing it, so a lesson is a route
 * through the page, not a second copy of it.
 */
const LESSONS = [
  {
    id: 1,
    title: 'Làm quen bàn phím',
    goal: 'Tìm được nốt Đô ở bất kỳ quãng tám nào, không cần đếm từ đầu đàn.',
    theory: [
      'Phím đen trên đàn xếp thành từng nhóm luân phiên: nhóm 2 phím rồi nhóm 3 phím, lặp đi lặp lại suốt bàn phím.',
      'Nốt Đô luôn là phím trắng nằm ngay bên trái nhóm 2 phím đen. Tìm được nhóm 2 phím đen là tìm được Đô, không phải đếm gì cả.',
      'Nốt Fa thì nằm ngay bên trái nhóm 3 phím đen. Hai mốc này đủ để định vị mọi nốt còn lại.',
    ],
    practice: { label: 'Đưa bàn phím về quãng Đô 4', action: "scrollKeyboardTo('C4')" },
    quiz: [
      { q: 'Nốt Đô nằm ở đâu so với nhóm 2 phím đen?', options: ['Ngay bên trái', 'Ngay bên phải', 'Ở giữa hai phím đen'], answer: 0 },
      { q: 'Phím trắng ngay bên trái nhóm 3 phím đen là nốt gì?', options: ['Nốt Son', 'Nốt Fa', 'Nốt Si'], answer: 1 },
      { q: 'Các nhóm phím đen xếp theo quy luật nào?', options: ['2 rồi 3, lặp lại', 'Toàn nhóm 2', '3 rồi 4, lặp lại'], answer: 0 },
    ],
  },
  {
    id: 2,
    title: 'Khuông nhạc và khóa Sol',
    goal: 'Hiểu khuông nhạc gồm những gì và khóa Sol dùng để làm gì.',
    theory: [
      'Khuông nhạc có 5 dòng kẻ và 4 khe nằm giữa các dòng. Nốt nhạc đặt trên dòng hoặc trong khe, càng cao trên khuông thì âm càng cao.',
      'Khóa nhạc đặt ở đầu khuông quyết định mỗi dòng mang tên nốt gì. Khóa Sol dùng cho tay phải, vùng âm cao.',
      'Nốt nào vượt quá 5 dòng kẻ thì viết trên dòng kẻ phụ — những vạch ngắn thêm vào phía trên hoặc phía dưới khuông.',
    ],
    practice: { label: 'Xem mẹo đọc nhanh khóa Sol', action: "switchTab('guide')" },
    quiz: [
      { q: 'Khuông nhạc có bao nhiêu dòng kẻ chính?', options: ['4 dòng', '5 dòng', '6 dòng'], answer: 1 },
      { q: 'Nốt viết càng cao trên khuông thì âm thanh thế nào?', options: ['Càng cao', 'Càng thấp', 'Không đổi'], answer: 0 },
      { q: 'Dòng kẻ phụ dùng để làm gì?', options: ['Trang trí', 'Ghi nốt vượt ra ngoài khuông', 'Đánh dấu ô nhịp'], answer: 1 },
    ],
  },
  {
    id: 3,
    title: 'Đọc nốt khóa Sol',
    goal: 'Đọc được nốt trên khuông khóa Sol mà không phải đếm từng dòng.',
    theory: [
      'Bốn nốt nằm trong khe của khóa Sol, đọc từ dưới lên, ghép thành chữ F-A-C-E — tức Fa, La, Đô, Mi.',
      'Năm nốt nằm trên dòng, từ dưới lên, là Mi Son Si Rê Fa. Nhớ một câu cho dễ: "Em Sẽ Sang Rước Phượng".',
      'Nốt Sol nằm ở dòng thứ hai từ dưới lên — chính là dòng mà khóa Sol cuộn quanh, nên khóa mới mang tên đó.',
    ],
    practice: { label: 'Chơi game nhận diện nốt', action: "switchTab('quiz')" },
    quiz: [
      { q: 'Bốn nốt trong khe khóa Sol ghép thành chữ gì?', options: ['F-A-C-E', 'C-A-G-E', 'B-E-A-D'], answer: 0 },
      { q: 'Nốt Sol nằm ở dòng thứ mấy tính từ dưới lên?', options: ['Dòng 1', 'Dòng 2', 'Dòng 3'], answer: 1 },
      { q: 'Nốt nằm ở dòng dưới cùng của khóa Sol là nốt gì?', options: ['Nốt Mi', 'Nốt Fa', 'Nốt Rê'], answer: 0 },
    ],
  },
  {
    id: 4,
    title: 'Khóa Fa và tay trái',
    goal: 'Đọc được nốt khóa Fa và biết vì sao tay trái dùng khóa này.',
    theory: [
      'Khóa Fa dùng cho vùng âm thấp, tức tay trái. Cùng một vị trí trên khuông, khóa Fa và khóa Sol đọc ra hai nốt khác nhau.',
      'Bốn nốt trong khe khóa Fa, từ dưới lên, là La Đô Mi Son. Năm nốt trên dòng là Son Si Rê Fa La.',
      'Nốt Đô 4 — Đô giữa — nằm ngay dưới khuông khóa Sol một dòng kẻ phụ, và ngay trên khuông khóa Fa một dòng kẻ phụ. Đó là nốt nối hai khuông lại với nhau.',
    ],
    practice: { label: 'Chuyển khuông sang khóa Fa', action: "setClef('bass')" },
    quiz: [
      { q: 'Khóa Fa dùng cho tay nào?', options: ['Tay phải', 'Tay trái', 'Cả hai như nhau'], answer: 1 },
      { q: 'Nốt Đô giữa nằm ở đâu so với khuông khóa Fa?', options: ['Một dòng kẻ phụ phía trên', 'Một dòng kẻ phụ phía dưới', 'Ở dòng giữa'], answer: 0 },
      { q: 'Cùng một dòng kẻ, khóa Fa và khóa Sol đọc ra?', options: ['Cùng một nốt', 'Hai nốt khác nhau', 'Tùy người đọc'], answer: 1 },
    ],
  },
  {
    id: 5,
    title: 'Trường độ',
    goal: 'Phân biệt nốt tròn, trắng, đen, móc đơn và biết mỗi loại ngân mấy phách.',
    theory: [
      'Hình dạng nốt cho biết nó ngân bao lâu. Nốt tròn 4 phách, nốt trắng 2 phách, nốt đen 1 phách, nốt móc đơn nửa phách.',
      'Nốt tròn và nốt trắng có đầu rỗng; nốt đen và nốt móc đơn có đầu đặc. Nốt tròn không có đuôi, ba loại còn lại đều có.',
      'Nốt móc đơn có thêm một cái móc ở đuôi. Cứ thêm một móc là trường độ lại chia đôi.',
    ],
    practice: { label: 'Nghe một câu có đủ các hình nốt', action: "switchTab('practice')" },
    quiz: [
      { q: 'Nốt tròn ngân mấy phách?', options: ['2 phách', '4 phách', '1 phách'], answer: 1 },
      { q: 'Nốt nào có đầu rỗng và có đuôi?', options: ['Nốt trắng', 'Nốt đen', 'Nốt tròn'], answer: 0 },
      { q: 'Một nốt móc đơn dài bằng bao nhiêu nốt đen?', options: ['Hai nốt đen', 'Nửa nốt đen', 'Bằng đúng một nốt đen'], answer: 1 },
    ],
  },
  {
    id: 6,
    title: 'Nhịp 4/4 và vạch nhịp',
    goal: 'Hiểu số chỉ nhịp, đếm được phách và giữ đều nhịp với máy gõ nhịp.',
    theory: [
      'Số chỉ nhịp đặt ở đầu bài. Số trên cho biết mỗi ô nhịp có mấy phách, số dưới cho biết lấy hình nốt nào làm một phách.',
      'Nhịp 4/4 nghĩa là mỗi ô nhịp có 4 phách, mỗi phách là một nốt đen. Vạch nhịp là đường thẳng đứng chia các ô nhịp.',
      'Phách đầu mỗi ô nhịp mạnh hơn các phách còn lại. Đếm "MỘT hai ba bốn" và nhấn vào tiếng "một".',
    ],
    practice: { label: 'Bật máy gõ nhịp nhịp 4/4', action: 'startMetronome()' },
    quiz: [
      { q: 'Trong nhịp 4/4, số 4 ở trên cho biết điều gì?', options: ['Mỗi ô nhịp có 4 phách', 'Bài dài 4 ô nhịp', 'Chơi bằng 4 ngón'], answer: 0 },
      { q: 'Vạch nhịp dùng để làm gì?', options: ['Chia các ô nhịp', 'Báo hết bài', 'Đánh dấu nốt cao'], answer: 0 },
      { q: 'Phách nào trong ô nhịp là phách mạnh?', options: ['Phách cuối', 'Phách đầu', 'Không phách nào'], answer: 1 },
    ],
  },
  {
    id: 7,
    title: 'Dấu lặng',
    goal: 'Nhận ra các dấu lặng và hiểu im lặng cũng được tính phách.',
    theory: [
      'Dấu lặng là khoảng im lặng có tính thời gian. Mỗi hình nốt đều có dấu lặng tương ứng, ngân đúng bằng chừng ấy phách.',
      'Lặng tròn treo dưới dòng thứ tư, lặng trắng nằm trên dòng thứ ba. Hai dấu này rất giống nhau, chỉ khác chỗ đặt — nhớ kỹ điểm đó.',
      'Im lặng vẫn phải đếm. Bỏ qua dấu lặng là ô nhịp thiếu phách và cả bài lệch đi.',
    ],
    practice: { label: 'Xem câu nhạc có dấu lặng', action: "switchTab('practice')" },
    quiz: [
      { q: 'Dấu lặng có được tính thời gian không?', options: ['Có, đếm như nốt nhạc', 'Không, cứ bỏ qua', 'Chỉ tính khi ở cuối bài'], answer: 0 },
      { q: 'Lặng tròn được đặt thế nào?', options: ['Treo dưới dòng thứ tư', 'Nằm trên dòng thứ ba', 'Ở dưới khuông'], answer: 0 },
      { q: 'Lặng đen ngân bao lâu?', options: ['1 phách', '4 phách', 'Nửa phách'], answer: 0 },
    ],
  },
  {
    id: 8,
    title: 'Gam Đô trưởng và ngón bấm',
    goal: 'Chơi được gam Đô trưởng hai tay với ngón bấm đúng.',
    theory: [
      'Gam Đô trưởng gồm bảy nốt trắng liên tiếp từ Đô đến Đô, không có phím đen nào.',
      'Bàn tay chỉ có 5 ngón mà gam có 8 nốt, nên phải đổi thế tay giữa chừng. Tay phải đi lên: luồn ngón cái xuống dưới bàn tay ở nốt Fa.',
      'Tay trái đi lên thì ngược lại: bắc ngón 3 qua ngón cái ở nốt La. Luyện chậm cho tay quen đường trước khi tăng tốc.',
    ],
    practice: { label: 'Nghe và xem gam Đô trưởng', action: 'playScale()' },
    quiz: [
      { q: 'Gam Đô trưởng có bao nhiêu phím đen?', options: ['Không có phím đen nào', 'Hai phím đen', 'Một phím đen'], answer: 0 },
      { q: 'Tay phải đi lên thì luồn ngón cái ở nốt nào?', options: ['Nốt Fa', 'Nốt Son', 'Nốt Si'], answer: 0 },
      { q: 'Vì sao phải luồn ngón cái?', options: ['Vì tay chỉ có 5 ngón mà gam có 8 nốt', 'Vì như vậy nghe hay hơn', 'Vì sách bảo thế'], answer: 0 },
    ],
  },
  {
    id: 9,
    title: 'Hợp âm tay trái',
    goal: 'Bấm được bảy hợp âm cơ bản và một vòng hợp âm hoàn chỉnh.',
    theory: [
      'Hợp âm là nhiều nốt vang lên cùng lúc. Hợp âm ba nốt cơ bản lấy nốt gốc, rồi cách một nốt lấy một nốt, hai lần.',
      'Bảy hợp âm C, Dm, Em, F, G, G7, Am đủ để đệm hầu hết bài trong giọng Đô trưởng.',
      'Thế đảo là cũng những nốt ấy nhưng xếp lại thứ tự, để tay đỡ phải nhảy xa khi chuyển hợp âm.',
    ],
    practice: { label: 'Nghe vòng hợp âm C – G – Am – F', action: 'playProgression(0)' },
    quiz: [
      { q: 'Hợp âm ba nốt được dựng thế nào?', options: ['Lấy nốt gốc rồi cách một nốt lấy một nốt', 'Ba nốt liền nhau', 'Ba nốt bất kỳ'], answer: 0 },
      { q: 'Thế đảo hợp âm để làm gì?', options: ['Để tay đỡ nhảy xa khi chuyển hợp âm', 'Để đổi sang hợp âm khác', 'Để chơi nhanh hơn'], answer: 0 },
      { q: 'Hợp âm Am gồm những nốt nào?', options: ['La – Đô – Mi', 'La – Đô# – Mi', 'La – Rê – Fa'], answer: 0 },
    ],
  },
  {
    id: 10,
    title: 'Ghép hai tay, bài hát đầu tiên',
    goal: 'Chơi trọn một bài: tay phải giai điệu, tay trái hợp âm.',
    theory: [
      'Tập riêng từng tay cho thật chắc trước đã. Ghép hai tay khi mỗi tay còn chưa thuộc thì chỉ tổ rối.',
      'Ghép thì bắt đầu thật chậm — chậm hơn mức bạn tưởng là cần. Đúng trước, nhanh sau; chơi nhanh mà sai thì chỉ luyện cho quen cái sai.',
      'Tập từng câu một, lặp lại tới khi trôi chảy rồi mới nối các câu lại. Trang này có nút lặp từng câu cho việc đó.',
    ],
    practice: { label: 'Mở bài hát tập chơi', action: "setSong('buom-vang')" },
    quiz: [
      { q: 'Nên làm gì trước khi ghép hai tay?', options: ['Tập riêng từng tay cho chắc', 'Ghép ngay cho quen', 'Tăng tốc độ lên trước'], answer: 0 },
      { q: 'Khi mới ghép hai tay nên chơi thế nào?', options: ['Thật chậm', 'Đúng tốc độ bài', 'Nhanh hết mức'], answer: 0 },
      { q: 'Chơi nhanh mà sai thì hậu quả là gì?', options: ['Luyện cho quen cái sai', 'Không sao, dần sẽ đúng', 'Nhanh thuộc bài hơn'], answer: 0 },
    ],
  },
];

const LESSON_STORAGE_KEY = 'tuhocdan.progress.v1';
let lessonProgress = { done: [] };
let openLesson = null;

// localStorage throws in some privacy modes and can hold anything at all,
// including whatever an older version of this page wrote. Treat it as
// untrusted input rather than as somewhere our own data is waiting.
function loadProgress() {
  try {
    const raw = window.localStorage && window.localStorage.getItem(LESSON_STORAGE_KEY);
    if (!raw) return { done: [] };
    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed && parsed.done) ? parsed.done : [];
    const valid = ids.filter(id => LESSONS.some(l => l.id === id));
    return { done: [...new Set(valid)].sort((a, b) => a - b) };
  } catch (e) {
    console.error('loadProgress: saved progress could not be read - starting fresh.', e);
    return { done: [] };
  }
}

function saveProgress() {
  try {
    if (window.localStorage) window.localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(lessonProgress));
    return true;
  } catch (e) {
    console.error('saveProgress: progress could not be saved.', e);
    return false;
  }
}

function markLessonDone(id) {
  if (!LESSONS.some(l => l.id === id)) {
    console.error(`markLessonDone: there is no lesson ${id}.`);
    return false;
  }
  if (!lessonProgress.done.includes(id)) {
    lessonProgress.done.push(id);
    lessonProgress.done.sort((a, b) => a - b);
  }
  saveProgress();
  renderLessonList();
  return true;
}

function resetProgress() {
  lessonProgress = { done: [] };
  saveProgress();
  openLesson = null;
  renderLessonList();
  renderLessonDetail();
  return true;
}

const lessonIsDone = (id) => lessonProgress.done.includes(id);

function renderLessonList() {
  const list = document.getElementById('lesson-list');
  if (!list) return;
  list.innerHTML = LESSONS.map(lesson => {
    const done = lessonIsDone(lesson.id);
    const open = openLesson === lesson.id;
    return `<button onclick="openLessonCard(${lesson.id})" class="w-full text-left px-4 py-3 rounded-xl border transition-all ${
      open ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
    }">
      <div class="flex items-center gap-3">
        <span class="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-black ${
          done ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
        }">${done ? '✓' : lesson.id}</span>
        <span class="text-sm font-bold text-slate-800">${lesson.title}</span>
      </div>
    </button>`;
  }).join('');

  const bar = document.getElementById('lesson-progress');
  if (bar) {
    const n = lessonProgress.done.length;
    bar.innerText = `Đã xong ${n}/${LESSONS.length} bài`;
  }
}

function openLessonCard(id) {
  if (!LESSONS.some(l => l.id === id)) {
    console.error(`openLessonCard: there is no lesson ${id}.`);
    return false;
  }
  openLesson = id;
  renderLessonList();
  renderLessonDetail();
  return true;
}

function renderLessonDetail() {
  const panel = document.getElementById('lesson-detail');
  if (!panel) return;

  const lesson = LESSONS.find(l => l.id === openLesson);
  if (!lesson) {
    panel.innerHTML = `<p class="text-sm text-slate-500">Chọn một bài ở bên trái để bắt đầu.</p>`;
    return;
  }

  const theory = lesson.theory.map(p => `<p class="text-sm text-slate-700 leading-relaxed mb-2">${p}</p>`).join('');
  const quiz = lesson.quiz.map((item, qi) => `
    <div class="mb-4">
      <p class="text-sm font-semibold text-slate-800 mb-2">${qi + 1}. ${item.q}</p>
      <div class="flex flex-col gap-1.5">
        ${item.options.map((opt, oi) =>
          `<button onclick="answerLessonQuiz(${lesson.id}, ${qi}, ${oi})"
                   id="lesson-answer-${qi}-${oi}"
                   class="text-left px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-all">${opt}</button>`
        ).join('')}
      </div>
    </div>`).join('');

  panel.innerHTML = `
    <h3 class="text-lg font-bold text-slate-900 mb-1">Bài ${lesson.id} · ${lesson.title}</h3>
    <p class="text-sm text-blue-700 font-semibold mb-4">${lesson.goal}</p>

    <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Lý thuyết</p>
    ${theory}

    <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mt-5 mb-2">Thực hành</p>
    <button onclick="${lesson.practice.action}"
            class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-all mb-5">
      ${lesson.practice.label}
    </button>

    <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Kiểm tra</p>
    ${quiz}
    <p id="lesson-result" class="text-sm font-bold text-slate-600"></p>`;

  lessonAnswers = {};
  showLessonResult(lesson);
}

let lessonAnswers = {};

function answerLessonQuiz(lessonId, questionIndex, optionIndex) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson || !lesson.quiz[questionIndex]) {
    console.error(`answerLessonQuiz: lesson ${lessonId} has no question ${questionIndex}.`);
    return false;
  }
  lessonAnswers[questionIndex] = optionIndex;

  const correct = optionIndex === lesson.quiz[questionIndex].answer;
  lesson.quiz[questionIndex].options.forEach((_, oi) => {
    const btn = document.getElementById(`lesson-answer-${questionIndex}-${oi}`);
    if (!btn) return;
    if (oi === optionIndex) {
      btn.className = correct
        ? 'text-left px-3 py-2 rounded-lg border-2 border-green-500 bg-green-50 text-sm font-semibold text-green-800 transition-all'
        : 'text-left px-3 py-2 rounded-lg border-2 border-red-400 bg-red-50 text-sm font-semibold text-red-800 transition-all';
    }
  });

  showLessonResult(lesson);
  return correct;
}

function lessonScore(lesson) {
  return lesson.quiz.reduce((n, item, qi) => n + (lessonAnswers[qi] === item.answer ? 1 : 0), 0);
}

function showLessonResult(lesson) {
  const out = document.getElementById('lesson-result');
  if (!out) return;
  const answered = Object.keys(lessonAnswers).length;
  if (answered === 0) { out.innerText = ''; return; }

  const score = lessonScore(lesson);
  if (answered < lesson.quiz.length) {
    out.innerText = `Đã trả lời ${answered}/${lesson.quiz.length} câu.`;
    return;
  }
  if (score === lesson.quiz.length) {
    out.innerText = 'Đúng cả ba câu — bài này xong rồi.';
    markLessonDone(lesson.id);
  } else {
    out.innerText = `Đúng ${score}/${lesson.quiz.length} câu. Đọc lại phần lý thuyết rồi thử lại nhé.`;
  }
}

/* ---- Intervals --------------------------------------------------------
 * An interval has two parts and they are counted differently. The NUMBER
 * counts letter names inclusively - C up to E is a third because C, D, E
 * is three letters - and takes no notice of sharps. The QUALITY comes from
 * the semitones. Deriving both from the note names keeps the two honest
 * about each other.
 */
const LETTER_ORDER = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
const SEMITONE_OF = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

function parseKey(key) {
  const m = /^([a-g])(#?)\/(\d)$/.exec(String(key));
  if (!m) return null;
  return { letter: m[1], sharp: Boolean(m[2]), octave: Number(m[3]) };
}

const diatonicIndex = (p) => LETTER_ORDER.indexOf(p.letter) + 7 * p.octave;
const semitoneIndex = (p) => SEMITONE_OF[p.letter] + (p.sharp ? 1 : 0) + 12 * p.octave;

// number -> the semitone counts that number can have, and what each is called
const INTERVAL_QUALITY = {
  2: { 1: 'thứ', 2: 'trưởng', 3: 'tăng' },
  3: { 2: 'giảm', 3: 'thứ', 4: 'trưởng', 5: 'tăng' },
  4: { 4: 'giảm', 5: 'đúng', 6: 'tăng' },
  5: { 6: 'giảm', 7: 'đúng', 8: 'tăng' },
  6: { 7: 'giảm', 8: 'thứ', 9: 'trưởng', 10: 'tăng' },
  7: { 9: 'giảm', 10: 'thứ', 11: 'trưởng', 12: 'tăng' },
  8: { 11: 'giảm', 12: 'đúng', 13: 'tăng' },
};

function intervalBetween(lowKey, highKey) {
  const a = parseKey(lowKey), b = parseKey(highKey);
  if (!a || !b) {
    console.error(`intervalBetween: "${lowKey}" and "${highKey}" are not both keys on this keyboard.`);
    return null;
  }
  // Measure from the lower note whichever way round they were given.
  const [lo, hi] = semitoneIndex(a) <= semitoneIndex(b) ? [a, b] : [b, a];

  const number = diatonicIndex(hi) - diatonicIndex(lo) + 1;
  const semitones = semitoneIndex(hi) - semitoneIndex(lo);

  if (number === 1) return { number: 1, semitones, quality: null, name: 'Cùng một nốt', unison: true };
  if (number > 8) {
    return { number, semitones, quality: null, name: `Quãng ${number} (rộng hơn một quãng tám)`, wide: true };
  }
  const quality = (INTERVAL_QUALITY[number] || {})[semitones] || null;
  return {
    number, semitones, quality,
    name: quality ? `Quãng ${number} ${quality}` : `Quãng ${number} (${semitones} nửa cung)`,
  };
}

const INTERVAL_ROOT = 'c/4';
const INTERVAL_STEPS = [
  { number: 2, key: 'd/4' }, { number: 3, key: 'e/4' }, { number: 4, key: 'f/4' },
  { number: 5, key: 'g/4' }, { number: 6, key: 'a/4' }, { number: 7, key: 'b/4' },
  { number: 8, key: 'c/5' },
];

function showInterval(highKey) {
  const interval = intervalBetween(INTERVAL_ROOT, highKey);
  if (!interval) return false;

  renderScoreSVG('interval-score', [{ keys: [INTERVAL_ROOT, highKey], dur: 'h' }], 'treble', 340, 180);

  const caption = document.getElementById('interval-caption');
  if (caption) caption.innerText = `${interval.name} — ${interval.semitones} nửa cung`;

  document.querySelectorAll('.white-key, .black-key').forEach(el => el.classList.remove('active'));
  for (const key of [INTERVAL_ROOT, highKey]) {
    const el = document.getElementById(`key-${key.replace('/', '_')}`);
    if (el) el.classList.add('active');
  }

  // Both notes together, then one after the other, is how an interval is
  // usually shown: the blend first, then the distance.
  const ctx = ensureAudio();
  const low = notesData.treble.find(n => n.key === INTERVAL_ROOT);
  const high = notesData.treble.find(n => n.key === highKey);
  if (low && high) {
    playTone(low.freq, { at: ctx.currentTime + 0.05, hold: 1.1, voice: 'interval-low' });
    playTone(high.freq, { at: ctx.currentTime + 0.05, hold: 1.1, voice: 'interval-high' });
    playTone(low.freq, { at: ctx.currentTime + 1.4, hold: 0.5, voice: 'interval-low-2' });
    playTone(high.freq, { at: ctx.currentTime + 2.0, hold: 0.7, voice: 'interval-high-2' });
  }
  return true;
}

/* ---- Flats, enharmonic spelling and key signatures --------------------
 * The decision the backlog left open: how to show C# and Db, which are the
 * same key on the keyboard but two different notes on the staff.
 *
 * The answer taken here is that the KEY is one thing and the SPELLING is
 * another. The keyboard keeps its single sharp-spelled name - one key, one
 * id, no duplicate data - and `item.spell: 'flat'` asks the staff to write
 * that same key the other way. A flat-spelled note sits on the letter
 * ABOVE, with a flat: C# is on the C line, Db on the D line. Same sound,
 * different place, which is exactly the thing a beginner has to see.
 */
const FLAT_SPELLING = { 'c#': 'd♭', 'd#': 'e♭', 'f#': 'g♭', 'g#': 'a♭', 'a#': 'b♭' };

// How far up the staff a flat spelling moves: onto the next letter.
function flatSpelledStep(step) { return step + 1; }

function flatNameOf(key) {
  const m = /^([a-g]#)\/(\d)$/.exec(String(key));
  if (!m || !FLAT_SPELLING[m[1]]) return null;
  return FLAT_SPELLING[m[1]].toUpperCase().replace('♭', '♭') + m[2];
}

/* Key signatures. The accidentals go in a fixed order at fixed heights -
 * that order is the whole convention, so it is written down once here and
 * the count decides how many of them are drawn.
 *
 * Steps are given for the treble clef; the bass clef sits two steps lower
 * for the same conventional position.
 */
const SHARP_ORDER = [
  { letter: 'F', step: 8 }, { letter: 'C', step: 5 }, { letter: 'G', step: 9 },
  { letter: 'D', step: 6 }, { letter: 'A', step: 3 }, { letter: 'E', step: 7 },
  { letter: 'B', step: 4 },
];
const FLAT_ORDER = [
  { letter: 'B', step: 4 }, { letter: 'E', step: 7 }, { letter: 'A', step: 3 },
  { letter: 'D', step: 6 }, { letter: 'G', step: 2 }, { letter: 'C', step: 5 },
  { letter: 'F', step: 1 },
];

const KEY_SIGNATURES = {
  'C':  { sharps: 0, flats: 0, label: 'Đô trưởng' },
  'G':  { sharps: 1, flats: 0, label: 'Sol trưởng' },
  'D':  { sharps: 2, flats: 0, label: 'Rê trưởng' },
  'A':  { sharps: 3, flats: 0, label: 'La trưởng' },
  'F':  { sharps: 0, flats: 1, label: 'Fa trưởng' },
  'Bb': { sharps: 0, flats: 2, label: 'Si giáng trưởng' },
  'Eb': { sharps: 0, flats: 3, label: 'Mi giáng trưởng' },
};

// Which accidentals a key signature puts on the staff, and where.
function keySignatureMarks(keyName, clef) {
  const sig = KEY_SIGNATURES[keyName];
  if (!sig) {
    console.error(`keySignatureMarks: there is no key signature for "${keyName}".`);
    return null;
  }
  const shift = clef === 'bass' ? -2 : 0;
  const order = sig.sharps ? SHARP_ORDER : FLAT_ORDER;
  const glyph = sig.sharps ? '♯' : '♭';
  return order.slice(0, sig.sharps || sig.flats)
              .map(mark => ({ letter: mark.letter, step: mark.step + shift, glyph }));
}


// Both spellings of one key, side by side, and the common key signatures.
function renderSpellingDemo() {
  renderScoreSVG('spell-sharp', [{ key: 'c#/4', dur: 'h', label: 'Đô♯' }], 'treble', 300, 170);
  renderScoreSVG('spell-flat', [{ key: 'c#/4', dur: 'h', spell: 'flat', label: 'Rê♭' }], 'treble', 300, 170);
}

function showKeySignature(keyName) {
  const sig = KEY_SIGNATURES[keyName];
  if (!sig) {
    console.error(`showKeySignature: there is no key signature for "${keyName}".`);
    return false;
  }
  renderScoreSVG('keysig-score', [{ key: 'c/4', dur: 'w' }], 'treble', 340, 170, null, keyName);
  const caption = document.getElementById('keysig-caption');
  if (caption) {
    const count = sig.sharps + sig.flats;
    caption.innerText = count === 0
      ? `${sig.label} — không dấu hoá nào`
      : `${sig.label} — ${count} dấu ${sig.sharps ? 'thăng' : 'giáng'}`;
  }
  return true;
}

/* ---- Playing from the computer keyboard -------------------------------
 * The usual two-row layout: the home row is the white keys and the row
 * above holds the black keys, sitting over the gaps between them exactly
 * as they do on the instrument. Z and X move an octave at a time.
 */
const COMPUTER_KEYS = [
  { code: 'KeyA', offset: 0,  colour: 'white' },   // C
  { code: 'KeyW', offset: 1,  colour: 'black' },   // C#
  { code: 'KeyS', offset: 2,  colour: 'white' },   // D
  { code: 'KeyE', offset: 3,  colour: 'black' },   // D#
  { code: 'KeyD', offset: 4,  colour: 'white' },   // E
  { code: 'KeyF', offset: 5,  colour: 'white' },   // F
  { code: 'KeyT', offset: 6,  colour: 'black' },   // F#
  { code: 'KeyG', offset: 7,  colour: 'white' },   // G
  { code: 'KeyY', offset: 8,  colour: 'black' },   // G#
  { code: 'KeyH', offset: 9,  colour: 'white' },   // A
  { code: 'KeyU', offset: 10, colour: 'black' },   // A#
  { code: 'KeyJ', offset: 11, colour: 'white' },   // B
  { code: 'KeyK', offset: 12, colour: 'white' },   // C, the octave above
];
const SEMITONE_KEYS = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
const TYPING_OCTAVE = { min: 2, max: 5, current: 4 };

// Which piano key a computer key reaches, at the octave now in play.
function computerKeyToPianoKey(code, octave = TYPING_OCTAVE.current) {
  const mapped = COMPUTER_KEYS.find(k => k.code === code);
  if (!mapped) return null;
  const letter = SEMITONE_KEYS[mapped.offset % 12];
  const key = `${letter}/${octave + Math.floor(mapped.offset / 12)}`;
  return keyboardKeys.some(k => k.key === key) ? key : null;
}

function setTypingOctave(octave) {
  if (!Number.isInteger(octave) || octave < TYPING_OCTAVE.min || octave > TYPING_OCTAVE.max) {
    console.error(`setTypingOctave: ${octave} is outside C${TYPING_OCTAVE.min}-C${TYPING_OCTAVE.max}.`);
    return false;
  }
  TYPING_OCTAVE.current = octave;
  const label = document.getElementById('typing-octave');
  if (label) label.innerText = `Quãng tám C${octave}`;
  return true;
}

// Typing into a box is typing, not playing.
function isTypingIntoSomething(target) {
  if (!target || !target.tagName) return false;
  const tag = String(target.tagName).toUpperCase();
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable === true;
}

function handleComputerKeyDown(event) {
  if (event.repeat) return false;                     // holding a key is one note
  if (event.ctrlKey || event.metaKey || event.altKey) return false;
  if (isTypingIntoSomething(event.target)) return false;

  if (event.code === 'KeyZ') { setTypingOctave(TYPING_OCTAVE.current - 1); return true; }
  if (event.code === 'KeyX') { setTypingOctave(TYPING_OCTAVE.current + 1); return true; }

  const key = computerKeyToPianoKey(event.code);
  if (!key) return false;
  if (event.preventDefault) event.preventDefault();
  handleKeyClick(key);
  return true;
}

/* ---- Breaking a passage across several lines ------------------------------
 * A twelve-bar song drawn on one staff is 1120px wide. On an iPad held
 * upright there are about 664px to put it in, so it either scrolls sideways
 * or is squeezed until the noteheads are too small to read. Printed music
 * solves this by running onto the next line, and so does this.
 *
 * Lines break at bar lines only, the meter is stated once on the first line,
 * and every line keeps its clef and its bar lines.
 */

// Where each bar begins. Without a meter there are no bars to break at.
function barStartIndices(items, timeSig) {
  const sig = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(timeSig || ''));
  if (!sig) return null;
  const capacity = Number(sig[1]) * 4 / Number(sig[2]);
  const starts = [];
  let beats = 0;
  items.forEach((item, i) => {
    if (Math.abs(beats % capacity) < 1e-9) starts.push(i);
    beats += itemBeats(item);
  });
  return { starts, capacity };
}

/* How wide a line can be. The page is max-w-6xl with px-4, each card adds p-6
 * and each score box p-3: 104px of chrome around the staff. Phones are not a
 * target - the keyboard alone is wider than one - so the floor is set where a
 * small tablet sits, not where a phone does. */
const SCORE_CHROME = 104;
const SCORE_WIDTH = { min: 480, max: 1000, fallback: 680 };

function scoreSystemWidth() {
  const viewport = (typeof window !== 'undefined' && window.innerWidth) || 0;
  if (!viewport) return SCORE_WIDTH.fallback;
  return Math.max(SCORE_WIDTH.min, Math.min(SCORE_WIDTH.max, Math.min(viewport, 1152) - SCORE_CHROME));
}

// Roughly 46px a slot keeps a notehead and its accidental legible.
const slotsPerSystem = (width) => Math.max(4, Math.round((width - 130) / 46));

/* Split items into lines, breaking only at bar lines. A bar longer than a
 * whole line gets a line of its own rather than being cut in half. */
function scoreSystems(items, timeSig, maxSlots) {
  const bars = barStartIndices(items, timeSig);
  if (!bars || bars.starts.length <= 1) return [{ from: 0, to: items.length - 1 }];

  const systems = [];
  let current = null;
  bars.starts.forEach((from, b) => {
    const to = (b + 1 < bars.starts.length ? bars.starts[b + 1] : items.length) - 1;
    const slots = to - from + 1;
    if (current && current.slots + slots > maxSlots) {
      systems.push(current);
      current = null;
    }
    if (!current) current = { from, to, slots };
    else { current.to = to; current.slots += slots; }
  });
  if (current) systems.push(current);
  return systems;
}

function renderScoreSystems(containerId, items, clef, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  if (!Array.isArray(items) || items.length === 0) {
    console.error(`renderScoreSystems: there is nothing to draw in "${containerId}".`);
    return false;
  }

  const width = opts.width || scoreSystemWidth();
  const height = opts.height || 190;
  const systems = scoreSystems(items, opts.timeSig, opts.maxSlots || slotsPerSystem(width));

  container.innerHTML = systems
    .map((_, i) => `<div id="${containerId}-line-${i}" class="w-full flex justify-center"></div>`)
    .join('');

  systems.forEach((system, i) => {
    renderScoreSVG(`${containerId}-line-${i}`, items.slice(system.from, system.to + 1), clef,
      width, height, opts.timeSig, opts.keySig, { hideMeterNumerals: i > 0 });
  });
  return systems.length;
}

/* ---- Playing it like an organ, not like a piano ---------------------------
 * Everything above this point is keyboard music in general. This part is what
 * makes the instrument an organ: a choice of sound, an automatic
 * accompaniment, and a left hand that names chords for the accompaniment to
 * play rather than playing them itself. That is how these instruments are
 * actually used.
 */

/* Voices. One oscillator per note, so a voice is a waveform plus an envelope
 * rather than additive synthesis - a real drawbar organ is several harmonics
 * stacked, and this is not that. It is enough to tell four sounds apart, and
 * it keeps one note to one oscillator, which everything downstream relies on.
 */
const VOICES = {
  organ:   { label: 'Organ',    wave: 'sine',     attack: 0.012, decay: 0.05, sustain: 0.92, release: 0.14 },
  piano:   { label: 'Piano',    wave: 'triangle', attack: 0.004, decay: 0.28, sustain: 0.22, release: 0.35 },
  strings: { label: 'Dàn dây',  wave: 'sawtooth', attack: 0.16,  decay: 0.20, sustain: 0.80, release: 0.45 },
  flute:   { label: 'Sáo',      wave: 'sine',     attack: 0.07,  decay: 0.10, sustain: 0.88, release: 0.22 },
};
let currentVoice = 'organ';

function setVoice(name) {
  if (!VOICES[name]) {
    console.error(`setVoice: there is no voice called "${name}".`);
    return false;
  }
  currentVoice = name;
  for (const id of Object.keys(VOICES)) {
    const btn = document.getElementById(`voice-btn-${id}`);
    if (btn) {
      btn.className = id === name
        ? 'px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm transition-all'
        : 'px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all';
    }
  }
  return true;
}

/* Drums, made from oscillators rather than noise buffers: a kick is a pitch
 * falling fast, a snare a short buzz, a hat a very short click up high. */
const DRUMS = {
  kick:  { wave: 'sine',   from: 140,  to: 45,   fall: 0.08, peak: 0.32, decay: 0.26 },
  snare: { wave: 'square', from: 190,  to: 110,  fall: 0.05, peak: 0.11, decay: 0.16 },
  hat:   { wave: 'square', from: 9000, to: 6200, fall: 0.02, peak: 0.045, decay: 0.05 },
};

function scheduleDrum(kind, at) {
  const spec = DRUMS[kind];
  if (!spec) {
    console.error(`scheduleDrum: there is no drum called "${kind}".`);
    return false;
  }
  const ctx = ensureAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = spec.wave;
  osc.frequency.setValueAtTime(spec.from, at);
  osc.frequency.exponentialRampToValueAtTime(spec.to, at + spec.fall);

  gain.gain.setValueAtTime(SILENT, at);
  gain.gain.exponentialRampToValueAtTime(spec.peak, at + 0.002);
  gain.gain.exponentialRampToValueAtTime(SILENT, at + spec.decay);

  osc.connect(gain);
  gain.connect(masterLimiter);
  osc.start(at);
  osc.stop(at + spec.decay + 0.02);
  return true;
}

/* Styles. Each is one bar, written as offsets in beats from the start of it.
 * `bass` names a note of the chord rather than a pitch, so a style plays over
 * any chord without being rewritten.
 */
const STYLES = {
  ballad: {
    label: 'Ballad', bpm: 76, beats: 4,
    drums: [[0, 'kick'], [1, 'snare'], [2, 'kick'], [3, 'snare'],
            [0, 'hat'], [0.5, 'hat'], [1, 'hat'], [1.5, 'hat'], [2, 'hat'], [2.5, 'hat'], [3, 'hat'], [3.5, 'hat']],
    bass: [[0, 0], [2, 2]],
    chords: [[1, 0.8], [3, 0.8]],
  },
  bolero: {
    label: 'Bolero', bpm: 88, beats: 4,
    drums: [[0, 'kick'], [1, 'snare'], [2.5, 'kick'], [3, 'snare'],
            [0, 'hat'], [1, 'hat'], [2, 'hat'], [3, 'hat']],
    bass: [[0, 0], [1.5, 2], [2.5, 0]],
    chords: [[1, 0.8], [3, 0.8]],
  },
  disco: {
    label: 'Disco', bpm: 120, beats: 4,
    drums: [[0, 'kick'], [1, 'kick'], [2, 'kick'], [3, 'kick'], [1, 'snare'], [3, 'snare'],
            [0.5, 'hat'], [1.5, 'hat'], [2.5, 'hat'], [3.5, 'hat']],
    bass: [[0, 0], [1, 2], [2, 0], [3, 2]],
    chords: [[0.5, 0.4], [1.5, 0.4], [2.5, 0.4], [3.5, 0.4]],
  },
};

const accompaniment = { running: false, styleId: 'ballad', chord: 'C', nextBarTime: 0, timer: null, bars: 0 };

function lowerOctave(key) {
  const cut = key.lastIndexOf('/');
  return `${key.slice(0, cut)}/${Number(key.slice(cut + 1)) - 1}`;
}

function setStyle(styleId) {
  if (!STYLES[styleId]) {
    console.error(`setStyle: there is no style called "${styleId}".`);
    return false;
  }
  accompaniment.styleId = styleId;
  setPlaybackBpm(STYLES[styleId].bpm);
  for (const id of Object.keys(STYLES)) {
    const btn = document.getElementById(`style-btn-${id}`);
    if (btn) {
      btn.className = id === styleId
        ? 'px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm transition-all'
        : 'px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all';
    }
  }
  return true;
}

function setAccompanimentChord(chordId) {
  if (!CHORDS[chordId]) {
    console.error(`setAccompanimentChord: there is no chord called "${chordId}".`);
    return false;
  }
  accompaniment.chord = chordId;
  const label = document.getElementById('accomp-chord');
  if (label) label.innerText = `${chordId} — ${CHORDS[chordId].label}`;
  return true;
}

// One bar of the current style over the chord as it stands right now.
function scheduleAccompanimentBar(at) {
  const style = STYLES[accompaniment.styleId];
  const notes = chordVoicing(accompaniment.chord, 0);
  if (!notes) return false;
  const secPerBeat = 60 / player.bpm;

  for (const [beat, kind] of style.drums) scheduleDrum(kind, at + beat * secPerBeat);

  for (const [beat, which] of style.bass) {
    const key = lowerOctave(notes[Math.min(which, notes.length - 1)]);
    const note = notesData.bass.find(n => n.key === key);
    if (note) playTone(note.freq, { at: at + beat * secPerBeat, hold: secPerBeat * 0.8, voice: `accomp-bass-${beat}` });
  }

  for (const [beat, hold] of style.chords) {
    for (const key of notes) {
      const note = notesData.bass.find(n => n.key === key);
      if (note) playTone(note.freq, { at: at + beat * secPerBeat, hold: secPerBeat * hold, voice: `accomp-chord-${beat}-${key}` });
    }
  }
  accompaniment.bars++;
  return true;
}

function accompanimentScheduler() {
  if (!accompaniment.running) return;
  const ctx = ensureAudio();
  const style = STYLES[accompaniment.styleId];
  const barLength = style.beats * (60 / player.bpm);
  while (accompaniment.nextBarTime < ctx.currentTime + SCHEDULE_AHEAD) {
    scheduleAccompanimentBar(accompaniment.nextBarTime);
    accompaniment.nextBarTime += barLength;
  }
}

function startAccompaniment() {
  if (accompaniment.running) return false;
  const ctx = ensureAudio();
  accompaniment.running = true;
  accompaniment.bars = 0;
  accompaniment.nextBarTime = ctx.currentTime + 0.1;
  accompanimentScheduler();
  accompaniment.timer = setInterval(accompanimentScheduler, LOOKAHEAD_MS);
  const btn = document.getElementById('accomp-toggle');
  if (btn) btn.innerText = 'Tắt điệu';
  return true;
}

function stopAccompaniment() {
  if (accompaniment.timer !== null) clearInterval(accompaniment.timer);
  accompaniment.timer = null;
  accompaniment.running = false;
  const btn = document.getElementById('accomp-toggle');
  if (btn) btn.innerText = 'Bật điệu';
  return true;
}

function toggleAccompaniment() {
  if (accompaniment.running) stopAccompaniment(); else startAccompaniment();
}

/* Single-finger chords. On a real organ the left hand names the chord and the
 * instrument plays it; you do not hold the whole triad down. Here, with the
 * accompaniment running, one white key below the split sets the chord.
 *
 * The seven white keys do not all carry a chord: B in C major wants a
 * diminished triad, which is not one of the seven a beginner is given, so it
 * is left unmapped and says so rather than being bent into something else.
 */
const SINGLE_FINGER_CHORDS = { c: 'C', d: 'Dm', e: 'Em', f: 'F', g: 'G', a: 'Am' };
const ACCOMP_SPLIT_OCTAVE = 4;      // keys below C4 belong to the left hand
let singleFingerMode = false;

function setSingleFingerMode(on) {
  singleFingerMode = Boolean(on);
  return singleFingerMode;
}

const isLeftHandKey = (key) => {
  const parsed = parseKey(key);
  return Boolean(parsed) && parsed.octave < ACCOMP_SPLIT_OCTAVE;
};

// Returns the chord a key names, or null if that key names none.
function singleFingerChord(key) {
  const parsed = parseKey(key);
  if (!parsed || parsed.sharp) return null;
  return SINGLE_FINGER_CHORDS[parsed.letter] || null;
}

/* Called for every key press. Returns the chord it selected, or null when the
 * press was an ordinary note. */
function handleSingleFinger(key) {
  if (!singleFingerMode || !accompaniment.running) return null;
  if (!isLeftHandKey(key)) return null;
  const chordId = singleFingerChord(key);
  if (!chordId) {
    console.error(`handleSingleFinger: "${key}" does not name one of the chords this page teaches.`);
    return null;
  }
  setAccompanimentChord(chordId);
  return chordId;
}

/* ---- The grand staff -----------------------------------------------------
 * Two staves joined by a brace, treble above bass, the way piano and organ
 * music is written. The one thing that makes this different from drawing two
 * staves one above the other is that the notes have to line up *in time*:
 * a note on beat 3 of the left hand must sit directly under beat 3 of the
 * right. So slots here are placed by accumulated beats, not by index the way
 * renderScoreSVG does it - a melody of eight quavers and an accompaniment of
 * two minims cover the same ground.
 */
const GRAND = { lineSpacing: 10, trebleTop: 50, staffGap: 60 };

function grandStaffGeometry() {
  const { lineSpacing, trebleTop, staffGap } = GRAND;
  const trebleY1 = trebleTop + 4 * lineSpacing;
  const bassTop = trebleY1 + staffGap;
  return { lineSpacing, trebleTop, trebleY1, bassTop, bassY1: bassTop + 4 * lineSpacing };
}

const partBeats = (items) => items.reduce((n, it) => n + itemBeats(it), 0);

function renderGrandStaff(containerId, parts, width = 760, height = 300, timeSig = null) {
  const container = document.getElementById(containerId);
  if (!container) return false;

  const treble = Array.isArray(parts && parts.treble) ? parts.treble : [];
  const bass = Array.isArray(parts && parts.bass) ? parts.bass : [];
  if (!treble.length && !bass.length) {
    console.error('renderGrandStaff: there is nothing on either staff.');
    return false;
  }

  // Two hands playing different lengths is a mistake in the piece, not
  // something to lay out anyway and hope nobody notices.
  const trebleLen = partBeats(treble), bassLen = partBeats(bass);
  if (treble.length && bass.length && Math.abs(trebleLen - bassLen) > 1e-9) {
    console.warn(`renderGrandStaff: tay phải ${trebleLen} phách, tay trái ${bassLen} phách - hai tay không khớp.`);
  }

  const g = grandStaffGeometry();
  let minY = g.trebleTop, maxY = g.bassY1;
  const seen = (y) => { if (y < minY) minY = y; if (y > maxY) maxY = y; };
  let svg = '';

  let meter = null;
  if (timeSig !== null && timeSig !== undefined) {
    const sig = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(timeSig));
    const top = sig && Number(sig[1]), bottom = sig && Number(sig[2]);
    if (!sig || top < 1 || bottom < 1) {
      console.error(`renderGrandStaff: unreadable time signature "${timeSig}" - drawing without one.`);
    } else {
      meter = { top, bottom, capacity: top * 4 / bottom };
    }
  }

  const startX = meter ? 92 : 68;
  const availWidth = width - startX - 40;
  const totalBeats = Math.max(trebleLen, bassLen) || 1;
  const beatW = availWidth / totalBeats;
  const xOfBeat = (b) => startX + 14 + b * beatW;

  // five lines each, twice
  for (const top of [g.trebleTop, g.bassTop]) {
    for (let i = 0; i < 5; i++) {
      const y = top + i * g.lineSpacing;
      svg += `<line x1="15" y1="${y}" x2="${width - 15}" y2="${y}" stroke="${STAFF_INK}" stroke-width="1.5"/>`;
    }
  }

  // The brace is what says "one instrument, two hands" rather than two
  // separate parts that happen to be printed together.
  svg += `<path d="M 13 ${g.trebleTop} C 4 ${g.trebleTop + 18}, 4 ${g.trebleTop + 30}, 10 ${(g.trebleTop + g.bassY1) / 2} `
       + `C 4 ${g.bassY1 - 30}, 4 ${g.bassY1 - 18}, 13 ${g.bassY1}" `
       + `fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
  svg += `<line x1="15" y1="${g.trebleTop}" x2="15" y2="${g.bassY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;

  svg += `<text x="20" y="${g.trebleTop + 32}" font-family="serif, 'Segoe UI Symbol', sans-serif" font-size="40" fill="${INK}" font-weight="bold">🎼</text>`;
  svg += `<g transform="translate(22, ${g.bassTop + 5})">
                    <path d="M 6 12 C 6 6 13 4 15 10 C 16 13 13 18 8 18 C 3 18 1 13 1 8 C 1 2 9 0 16 3 C 21 6 22 13 20 20 C 17 28 8 33 2 35" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
                    <circle cx="25" cy="6" r="2.5" fill="${INK}"/>
                    <circle cx="25" cy="16" r="2.5" fill="${INK}"/>
                  </g>`;

  if (meter) {
    const sigAttrs = `font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="${INK}" text-anchor="middle" dominant-baseline="central"`;
    for (const y1 of [g.trebleY1, g.bassY1]) {
      svg += `<text x="66" y="${y1 - 6 * (g.lineSpacing / 2)}" ${sigAttrs}>${meter.top}</text>`;
      svg += `<text x="66" y="${y1 - 2 * (g.lineSpacing / 2)}" ${sigAttrs}>${meter.bottom}</text>`;
    }

    // One bar line through both staves - that is what a grand staff is.
    for (let b = meter.capacity; b < totalBeats - 1e-9; b += meter.capacity) {
      const bx = xOfBeat(b) - beatW * 0.18;
      svg += `<line x1="${bx}" y1="${g.trebleTop}" x2="${bx}" y2="${g.bassY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;
    }
  }

  // closing double bar, through both staves
  svg += `<line x1="${width - 21}" y1="${g.trebleTop}" x2="${width - 21}" y2="${g.bassY1}" stroke="${STAFF_INK}" stroke-width="2"/>`;
  svg += `<line x1="${width - 15}" y1="${g.trebleTop}" x2="${width - 15}" y2="${g.bassY1}" stroke="${STAFF_INK}" stroke-width="5"/>`;

  const drawPart = (items, lineY1, clef) => {
    let beats = 0;
    items.forEach((item, idx) => {
      const after = beats + itemBeats(item);
      const drawn = drawStaffItem(item, {
        x: xOfBeat(beats), lineY1, lineSpacing: g.lineSpacing,
        topMargin: lineY1 - 4 * g.lineSpacing, clef,
        nextItem: items[idx + 1], nextX: xOfBeat(after),
      });
      svg += drawn.svg;
      if (drawn.minY < Infinity) { seen(drawn.minY); seen(drawn.maxY); }
      beats = after;
    });
  };
  drawPart(treble, g.trebleY1, 'treble');
  drawPart(bass, g.bassY1, 'bass');

  const vbTop = Math.min(0, minY - 14);
  const vbBottom = Math.max(height, maxY + 14);
  container.innerHTML = `<svg width="${width}" height="${height}" viewBox="0 ${vbTop} ${width} ${vbBottom - vbTop}" `
    + `preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="select-none">`
    + svg + `</svg>`;
  return true;
}

/* ---- Pieces for two hands -------------------------------------------------
 * The left hand is written as chord names, not as note lists: the notes come
 * from CHORDS through chordVoicing, so a chord is spelled in exactly one
 * place in this project and T8 already checks that spelling against theory.
 */
const TWO_HAND_PIECES = [
  {
    id: 'anh-sao-nho-2-tay',
    title: 'Ánh Sao Nhỏ — hai tay',
    origin: 'Giai điệu dân ca Pháp "Ah! vous dirai-je, maman" — phạm vi công cộng',
    timeSig: '4/4',
    treble: [
      { key: 'c/4' }, { key: 'c/4' }, { key: 'g/4' }, { key: 'g/4' },
      { key: 'a/4' }, { key: 'a/4' }, { key: 'g/4', dur: 'h' },
      { key: 'f/4' }, { key: 'f/4' }, { key: 'e/4' }, { key: 'e/4' },
      { key: 'd/4' }, { key: 'd/4' }, { key: 'c/4', dur: 'h' },
    ],
    // One chord to the half bar, which is as slow as an accompaniment gets.
    bassChords: [
      { chord: 'C', dur: 'w' },
      { chord: 'F', dur: 'h' }, { chord: 'C', dur: 'h' },
      { chord: 'F', dur: 'h' }, { chord: 'C', dur: 'h' },
      { chord: 'G7', dur: 'h' }, { chord: 'C', dur: 'h' },
    ],
  },
];

// Turn the chord names of a left hand into notes to draw and play.
function twoHandBass(piece) {
  const out = [];
  for (const entry of piece.bassChords) {
    const notes = chordVoicing(entry.chord, 0);
    if (!notes) return null;
    out.push({ keys: notes, dur: entry.dur, label: entry.chord });
  }
  return out;
}

/* Both hands as one list to practise: everything that starts at the same
 * moment becomes one chord, which the grading already knows how to wait for.
 */
function twoHandPracticeItems(piece) {
  const bass = twoHandBass(piece);
  if (!bass) return null;

  const onsets = new Map();
  const collect = (items) => {
    let beats = 0;
    for (const item of items) {
      if (!item.rest) {
        const keys = Array.isArray(item.keys) ? item.keys : [item.key];
        const at = Math.round(beats * 1000) / 1000;
        if (!onsets.has(at)) onsets.set(at, []);
        for (const key of keys) if (!onsets.get(at).includes(key)) onsets.get(at).push(key);
      }
      beats += itemBeats(item);
    }
  };
  collect(piece.treble);
  collect(bass);

  return [...onsets.keys()].sort((a, b) => a - b).map(beat => ({ beat, keys: onsets.get(beat) }));
}

// Play a two-hand piece: each hand keeps its own clock, and they meet because
// both are measured in beats from the same start.
function playTwoHands(pieceId) {
  const piece = TWO_HAND_PIECES.find(p => p.id === pieceId);
  if (!piece) {
    console.error(`playTwoHands: there is no piece called "${pieceId}".`);
    return false;
  }
  const bass = twoHandBass(piece);
  if (!bass) return false;

  const ctx = ensureAudio();
  const secPerBeat = 60 / player.bpm;
  const at0 = ctx.currentTime + 0.1;

  const schedule = (items, clef, tag) => {
    let beats = 0;
    items.forEach((item, idx) => {
      const seconds = itemBeats(item) * secPerBeat;
      if (!item.rest) {
        const keys = Array.isArray(item.keys) ? item.keys : [item.key];
        for (const key of keys) {
          const note = notesData[clef].find(n => n.key === key);
          if (note) playTone(note.freq, { at: at0 + beats * secPerBeat, hold: seconds * 0.92, voice: `${tag}-${idx}-${key}` });
        }
      }
      beats += itemBeats(item);
    });
  };
  schedule(piece.treble, 'treble', 'rh');
  schedule(bass, 'bass', 'lh');
  return true;
}

function showTwoHandPiece(pieceId) {
  const piece = TWO_HAND_PIECES.find(p => p.id === pieceId);
  if (!piece) {
    console.error(`showTwoHandPiece: there is no piece called "${pieceId}".`);
    return false;
  }
  const bass = twoHandBass(piece);
  if (!bass) return false;
  renderGrandStaff('twohand-score', { treble: piece.treble, bass }, scoreSystemWidth(), 300, piece.timeSig);
  const caption = document.getElementById('twohand-origin');
  if (caption) caption.innerText = piece.origin;
  return true;
}

/* ---- Grading what the learner plays --------------------------------------
 * Everything else on this page demonstrates. This is the only part that
 * watches the learner and says whether they got it right, which is the thing
 * a person teaching themselves at home has no other way of finding out.
 *
 * It waits rather than races: the passage does not move on until the right
 * key is pressed. Getting the notes right comes before getting them up to
 * speed - which is what lesson 10 tells the learner in so many words - so
 * nothing here is graded against the clock. Playing in tempo is a separate
 * skill and would need a separate exercise.
 */
const practice = {
  active: false,
  items: [],
  clef: 'treble',
  parts: null,        // set for a two-hand piece: { treble, bass }
  timeSig: null,      // whatever the passage is written in, not an assumption
  title: '',
  index: 0,
  pressed: [],        // keys of the current item already played, for chords
  correct: 0,
  wrong: 0,
  mistakes: [],
};

// What the learner has to play at this point, or null once the passage is done.
function practiceExpected() {
  if (!practice.active) return null;
  const item = practice.items[practice.index];
  if (!item) return null;
  return Array.isArray(item.keys) ? item.keys.slice() : [item.key];
}

// Rests are not played, so the cursor steps over them rather than waiting for
// a key that is never going to come.
function skipPracticeRests() {
  while (practice.items[practice.index] && practice.items[practice.index].rest) practice.index++;
}

function startPractice(items, opts = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    console.error('startPractice: there is nothing to practise.');
    return false;
  }
  const clef = opts.clef || 'treble';
  const parts = opts.parts || null;
  // A two-hand piece spans both staves, so what matters is that the keys are
  // on the instrument, not that they fit one clef.
  const playable = (key) => parts
    ? keyboardKeys.some(k => k.key === key)
    : notesData[clef].some(n => n.key === key);
  const missing = items.filter(it => !it.rest)
    .flatMap(it => (Array.isArray(it.keys) ? it.keys : [it.key]))
    .filter(key => !playable(key));
  if (missing.length) {
    console.error(`startPractice: ${missing.join(', ')} ${parts ? 'is not on the keyboard' : `cannot be played in the "${clef}" clef`}.`);
    return false;
  }

  practice.active = true;
  practice.items = items;
  practice.clef = clef;
  practice.parts = parts;
  practice.timeSig = opts.timeSig || null;
  practice.title = opts.title || '';
  practice.index = 0;
  practice.pressed = [];
  practice.correct = 0;
  practice.wrong = 0;
  practice.mistakes = [];
  skipPracticeRests();
  renderPractice();
  return true;
}

function stopPractice() {
  practice.active = false;
  practice.pressed = [];
  showNextKeys([]);
  renderPractice();
  return true;
}

const practiceFinished = () => practice.active && practice.index >= practice.items.length;

function practiceAccuracy() {
  const tried = practice.correct + practice.wrong;
  return tried === 0 ? null : practice.correct / tried;
}

/* One key press, judged.
 *
 * Returns 'correct', 'wrong', 'complete' when that press finished the
 * passage, or null when nothing is being practised. A wrong note is counted
 * and the cursor stays put: being told which note was wanted, and being left
 * to find it, is the whole point.
 */
function gradeKeyPress(key) {
  // practiceExpected() is the single gate: it returns null when nothing is
  // being practised and when the passage has been played out.
  const expected = practiceExpected();
  if (!expected) return null;

  if (!expected.includes(key) || practice.pressed.includes(key)) {
    practice.wrong++;
    practice.mistakes.push({ index: practice.index, expected: expected.slice(), got: key });
    renderPractice();
    return 'wrong';
  }

  practice.pressed.push(key);
  if (practice.pressed.length < expected.length) {     // a chord, still incomplete
    renderPractice();
    return 'correct';
  }

  practice.correct++;
  practice.pressed = [];
  practice.index++;
  skipPracticeRests();

  const done = practiceFinished();
  renderPractice();
  return done ? 'complete' : 'correct';
}

/* ---- what the learner sees ---- */

function showNextKeys(keys) {
  document.querySelectorAll('.white-key, .black-key').forEach(el => el.classList.remove('key-next'));
  for (const key of keys) {
    const el = document.getElementById(`key-${key.replace('/', '_')}`);
    if (el) el.classList.add('key-next');
  }
}

function renderPractice() {
  const score = document.getElementById('practice-score');
  const status = document.getElementById('practice-status');
  if (!score || !status) return;

  if (!practice.active) {
    score.innerHTML = '';
    status.innerHTML = '<p class="text-sm text-slate-500">Chọn một bài ở trên rồi bấm "Bắt đầu tập".</p>';
    return;
  }

  // The note being waited for is marked on the staff, not moved or resized.
  if (practice.parts) {
    // Both hands: mark everything that starts at the moment being waited for,
    // which is what makes it clear the two notes are meant to land together.
    const at = practice.items[practice.index] ? practice.items[practice.index].beat : null;
    const mark = (items) => {
      let beats = 0;
      return items.map(item => {
        const onset = Math.round(beats * 1000) / 1000;
        beats += itemBeats(item);
        return onset === at ? { ...item, highlight: true } : item;
      });
    };
    renderGrandStaff('practice-score',
      { treble: mark(practice.parts.treble), bass: mark(practice.parts.bass) },
      scoreSystemWidth(), 300, practice.timeSig);
  } else {
    const shown = practice.items.map((item, i) =>
      i === practice.index ? { ...item, highlight: true } : item);
    renderScoreSystems('practice-score', shown, practice.clef, { timeSig: practice.timeSig });
  }

  const expected = practiceExpected();
  showNextKeys(expected || []);

  const accuracy = practiceAccuracy();
  const tally = `<span class="text-green-700 font-bold">${practice.correct} đúng</span>`
    + ` · <span class="text-red-600 font-bold">${practice.wrong} sai</span>`
    + (accuracy === null ? '' : ` · <span class="font-bold text-slate-700">${Math.round(accuracy * 100)}% chính xác</span>`);

  if (practiceFinished()) {
    const perfect = practice.wrong === 0;
    status.innerHTML = `<p class="text-sm font-bold ${perfect ? 'text-green-700' : 'text-slate-700'} mb-1">`
      + (perfect ? 'Xong cả bài, không sai nốt nào.' : 'Xong cả bài.')
      + `</p><p class="text-sm">${tally}</p>`;
    return;
  }

  const names = (expected || []).map(k => {
    const note = notesData[practice.clef].find(n => n.key === k);
    return note ? note.noteName : k;
  });
  status.innerHTML = `<p class="text-sm text-slate-700 mb-1">Nốt tiếp theo: `
    + `<span class="font-bold text-blue-700">${names.join(' + ')}</span>`
    + ` <span class="text-slate-400">(nốt ${practice.index + 1}/${practice.items.length})</span></p>`
    + `<p class="text-sm">${tally}</p>`;
}

/* What can be practised: the reading exercise, the scale, and each song. */
function practiceSources() {
  return [
    { id: 'demo', label: 'Câu tập đọc', items: DEMO_PHRASE, clef: 'treble', timeSig: '4/4' },
    ...Object.keys(SCALES).map(hand => ({
      id: `scale-${hand}`, label: `Gam Đô trưởng · ${SCALES[hand].label}`,
      items: scalePassage(hand), clef: SCALES[hand].clef, timeSig: '4/4',
    })),
    ...SONGS.map(song => ({
      id: `song-${song.id}`, label: song.title, items: song.notes, clef: song.clef, timeSig: song.timeSig,
    })),
    ...TWO_HAND_PIECES.map(piece => ({
      id: `two-${piece.id}`, label: piece.title, timeSig: piece.timeSig, clef: 'treble',
      items: twoHandPracticeItems(piece) || [],
      parts: { treble: piece.treble, bass: twoHandBass(piece) },
    })),
  ];
}

function startPracticeSource(id) {
  const source = practiceSources().find(s => s.id === id);
  if (!source) {
    console.error(`startPracticeSource: there is nothing called "${id}" to practise.`);
    return false;
  }
  return startPractice(source.items, {
    clef: source.clef, timeSig: source.timeSig, title: source.label, parts: source.parts,
  });
}

function buildOrganControls() {
  const voices = document.getElementById('voice-buttons');
  if (voices) {
    voices.innerHTML = Object.entries(VOICES).map(([id, v]) =>
      `<button id="voice-btn-${id}" onclick="setVoice('${id}')" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all">${v.label}</button>`
    ).join('');
  }
  const styles = document.getElementById('style-buttons');
  if (styles) {
    styles.innerHTML = Object.entries(STYLES).map(([id, st]) =>
      `<button id="style-btn-${id}" onclick="setStyle('${id}')" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all">${st.label} · ${st.bpm} BPM</button>`
    ).join('');
  }
  const chords = document.getElementById('accomp-chords');
  if (chords) {
    chords.innerHTML = Object.keys(CHORDS).map(id =>
      `<button onclick="setAccompanimentChord('${id}')" class="chord-btn">${id}</button>`
    ).join('');
  }
  setVoice(currentVoice);
  setStyle(accompaniment.styleId);
  setAccompanimentChord(accompaniment.chord);
}

function buildPracticeSources() {
  const row = document.getElementById('practice-sources');
  if (!row) return;
  row.innerHTML = practiceSources().map(s =>
    `<button onclick="startPracticeSource('${s.id}')" class="chord-btn">${s.label}</button>`
  ).join('');
}

/* ---- Ear training -----------------------------------------------------
 * Same shape as the note-reading game, but the question arrives through
 * the ears: hear a note and name it, or hear two notes and name the
 * distance between them.
 */
const EAR_MODES = {
  note:     { label: 'Nghe nốt',  prompt: 'Nốt vừa nghe là nốt gì?' },
  interval: { label: 'Nghe quãng', prompt: 'Hai nốt vừa nghe cách nhau quãng mấy?' },
};
const EAR_POOL = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];
const EAR_OPTION_COUNT = 4;

const earTraining = { mode: 'note', question: null, score: 0, streak: 0, answered: false };

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

// Fill up to `count` distinct options around the right one, then shuffle so
// the answer is not always in the same place.
function buildOptions(answer, pool, count) {
  const options = [answer];
  const rest = pool.filter(o => o !== answer);
  while (options.length < count && rest.length) {
    options.push(rest.splice(Math.floor(Math.random() * rest.length), 1)[0]);
  }
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

function setEarMode(mode) {
  if (!EAR_MODES[mode]) {
    console.error(`setEarMode: there is no ear training mode called "${mode}".`);
    return false;
  }
  earTraining.mode = mode;
  earTraining.question = null;
  earTraining.answered = false;
  renderEarTraining();
  return true;
}

function newEarQuestion() {
  if (earTraining.mode === 'note') {
    const key = pickRandom(EAR_POOL);
    const note = notesData.treble.find(n => n.key === key);
    earTraining.question = {
      kind: 'note', keys: [key], answer: note.noteName,
      options: buildOptions(note.noteName, EAR_POOL.map(k => notesData.treble.find(n => n.key === k).noteName), EAR_OPTION_COUNT),
    };
  } else {
    const step = pickRandom(INTERVAL_STEPS);
    const interval = intervalBetween(INTERVAL_ROOT, step.key);
    earTraining.question = {
      kind: 'interval', keys: [INTERVAL_ROOT, step.key], answer: interval.name,
      options: buildOptions(interval.name,
        INTERVAL_STEPS.map(s => intervalBetween(INTERVAL_ROOT, s.key).name), EAR_OPTION_COUNT),
    };
  }
  earTraining.answered = false;
  playEarQuestion();
  renderEarTraining();
  return earTraining.question;
}

// Deliberately no highlighting and nothing drawn: the whole point is that
// the answer has to come from the ear, so showing the keys would give it away.
function playEarQuestion() {
  const question = earTraining.question;
  if (!question) {
    console.error('playEarQuestion: there is no question to play.');
    return false;
  }
  const ctx = ensureAudio();
  question.keys.forEach((key, i) => {
    const note = notesData.treble.find(n => n.key === key);
    if (!note) return;
    playTone(note.freq, { at: ctx.currentTime + 0.05 + i * 0.75, hold: 0.7, voice: `ear-${i}` });
  });
  return true;
}

function answerEar(optionIndex) {
  const question = earTraining.question;
  if (!question || !question.options[optionIndex]) {
    console.error(`answerEar: there is no option ${optionIndex} to choose.`);
    return null;
  }
  if (earTraining.answered) return null;      // one go per question

  const correct = question.options[optionIndex] === question.answer;
  earTraining.answered = true;
  if (correct) {
    earTraining.score++;
    earTraining.streak++;
  } else {
    earTraining.streak = 0;
  }
  renderEarTraining();
  return correct;
}

function renderEarTraining() {
  const panel = document.getElementById('ear-panel');
  if (!panel) return;
  const question = earTraining.question;

  if (!question) {
    panel.innerHTML = `<p class="text-sm text-slate-500">Bấm "Câu mới" để nghe câu hỏi đầu tiên.</p>`;
  } else {
    panel.innerHTML = `
      <p class="text-sm font-semibold text-slate-800 mb-3">${EAR_MODES[earTraining.mode].prompt}</p>
      <div class="grid grid-cols-2 gap-2">
        ${question.options.map((opt, i) => {
          const state = !earTraining.answered ? 'border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
            : opt === question.answer ? 'border-green-500 bg-green-50 text-green-800'
            : 'border-slate-200 text-slate-400';
          return `<button onclick="answerEar(${i})" class="px-3 py-2 rounded-lg border-2 text-sm font-bold transition-all ${state}">${opt}</button>`;
        }).join('')}
      </div>`;
  }

  const score = document.getElementById('ear-score');
  if (score) score.innerText = `Đúng ${earTraining.score} · Chuỗi ${earTraining.streak}`;
}

/* ---- Songs to play ----------------------------------------------------
 * Public domain only, as the backlog requires, and only melodies whose
 * notes I could set down with confidence - a song encoded from a hazy
 * memory of it would teach the wrong tune, which is worse than one fewer
 * song. `origin` records why each one is free to use.
 *
 * All four sit in C major within one octave of the right hand, except for
 * the low G in Kìa Con Bướm Vàng, which is part of the tune.
 */
const SONGS = [
  {
    id: 'buom-vang',
    title: 'Kìa Con Bướm Vàng',
    origin: 'Giai điệu dân ca Pháp "Frère Jacques" — phạm vi công cộng',
    clef: 'treble', timeSig: '4/4', barsPerPhrase: 2,
    notes: [
      { key: 'c/4' }, { key: 'd/4' }, { key: 'e/4' }, { key: 'c/4' },
      { key: 'c/4' }, { key: 'd/4' }, { key: 'e/4' }, { key: 'c/4' },
      { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4', dur: 'h' },
      { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4', dur: 'h' },
      { key: 'g/4', dur: 'e' }, { key: 'a/4', dur: 'e' }, { key: 'g/4', dur: 'e' }, { key: 'f/4', dur: 'e' },
      { key: 'e/4' }, { key: 'c/4' },
      { key: 'g/4', dur: 'e' }, { key: 'a/4', dur: 'e' }, { key: 'g/4', dur: 'e' }, { key: 'f/4', dur: 'e' },
      { key: 'e/4' }, { key: 'c/4' },
      { key: 'c/4' }, { key: 'g/3' }, { key: 'c/4', dur: 'h' },
      { key: 'c/4' }, { key: 'g/3' }, { key: 'c/4', dur: 'h' },
    ],
  },
  {
    id: 'anh-sao-nho',
    title: 'Ánh Sao Nhỏ',
    origin: 'Giai điệu dân ca Pháp "Ah! vous dirai-je, maman" — phạm vi công cộng',
    clef: 'treble', timeSig: '4/4', barsPerPhrase: 2,
    notes: [
      { key: 'c/4' }, { key: 'c/4' }, { key: 'g/4' }, { key: 'g/4' },
      { key: 'a/4' }, { key: 'a/4' }, { key: 'g/4', dur: 'h' },
      { key: 'f/4' }, { key: 'f/4' }, { key: 'e/4' }, { key: 'e/4' },
      { key: 'd/4' }, { key: 'd/4' }, { key: 'c/4', dur: 'h' },
      { key: 'g/4' }, { key: 'g/4' }, { key: 'f/4' }, { key: 'f/4' },
      { key: 'e/4' }, { key: 'e/4' }, { key: 'd/4', dur: 'h' },
      { key: 'g/4' }, { key: 'g/4' }, { key: 'f/4' }, { key: 'f/4' },
      { key: 'e/4' }, { key: 'e/4' }, { key: 'd/4', dur: 'h' },
      { key: 'c/4' }, { key: 'c/4' }, { key: 'g/4' }, { key: 'g/4' },
      { key: 'a/4' }, { key: 'a/4' }, { key: 'g/4', dur: 'h' },
      { key: 'f/4' }, { key: 'f/4' }, { key: 'e/4' }, { key: 'e/4' },
      { key: 'd/4' }, { key: 'd/4' }, { key: 'c/4', dur: 'h' },
    ],
  },
  {
    id: 'chu-cuu-nho',
    title: 'Chú Cừu Nhỏ',
    origin: 'Giai điệu dân gian Anh "Mary Had a Little Lamb" — phạm vi công cộng',
    clef: 'treble', timeSig: '4/4', barsPerPhrase: 2,
    notes: [
      { key: 'e/4' }, { key: 'd/4' }, { key: 'c/4' }, { key: 'd/4' },
      { key: 'e/4' }, { key: 'e/4' }, { key: 'e/4', dur: 'h' },
      { key: 'd/4' }, { key: 'd/4' }, { key: 'd/4', dur: 'h' },
      { key: 'e/4' }, { key: 'g/4' }, { key: 'g/4', dur: 'h' },
      { key: 'e/4' }, { key: 'd/4' }, { key: 'c/4' }, { key: 'd/4' },
      { key: 'e/4' }, { key: 'e/4' }, { key: 'e/4' }, { key: 'e/4' },
      { key: 'd/4' }, { key: 'd/4' }, { key: 'e/4' }, { key: 'd/4' },
      { key: 'c/4', dur: 'w' },
    ],
  },
  {
    id: 'khuc-hoan-ca',
    title: 'Khúc Hoan Ca',
    origin: 'Beethoven, "Ode an die Freude" (1824) — phạm vi công cộng',
    clef: 'treble', timeSig: '4/4', barsPerPhrase: 2,
    notes: [
      { key: 'e/4' }, { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4' },
      { key: 'g/4' }, { key: 'f/4' }, { key: 'e/4' }, { key: 'd/4' },
      { key: 'c/4' }, { key: 'c/4' }, { key: 'd/4' }, { key: 'e/4' },
      { key: 'e/4', dot: true }, { key: 'd/4', dur: 'e' }, { key: 'd/4', dur: 'h' },
      { key: 'e/4' }, { key: 'e/4' }, { key: 'f/4' }, { key: 'g/4' },
      { key: 'g/4' }, { key: 'f/4' }, { key: 'e/4' }, { key: 'd/4' },
      { key: 'c/4' }, { key: 'c/4' }, { key: 'd/4' }, { key: 'e/4' },
      { key: 'd/4', dot: true }, { key: 'c/4', dur: 'e' }, { key: 'c/4', dur: 'h' },
    ],
  },
];

let currentSong = SONGS[0];

// Where each bar starts, so a phrase can be practised on its own.
function songBarStarts(song) {
  const capacity = Number(song.timeSig.split('/')[0]) * 4 / Number(song.timeSig.split('/')[1]);
  const starts = [];
  let beats = 0;
  song.notes.forEach((item, i) => {
    if (beats % capacity < 1e-9) starts.push(i);
    beats += itemBeats(item);
  });
  return { starts, capacity, beats };
}

function songPhrases(song) {
  const { starts } = songBarStarts(song);
  const phrases = [];
  for (let bar = 0; bar < starts.length; bar += song.barsPerPhrase) {
    const from = starts[bar];
    const nextBar = bar + song.barsPerPhrase;
    const to = (nextBar < starts.length ? starts[nextBar] : song.notes.length) - 1;
    phrases.push({ from, to, label: `Câu ${phrases.length + 1}` });
  }
  return phrases;
}

function setSong(songId) {
  const song = SONGS.find(s => s.id === songId);
  if (!song) {
    console.error(`setSong: there is no song called "${songId}".`);
    return false;
  }
  stopSequence();
  currentSong = song;
  showSong();
  return true;
}

function showSong() {
  const song = currentSong;
  renderScoreSystems('song-score', song.notes, song.clef, { timeSig: song.timeSig });

  const origin = document.getElementById('song-origin');
  if (origin) origin.innerText = song.simplified ? `${song.origin} · ${song.simplified}` : song.origin;

  const picker = document.getElementById('song-picker');
  if (picker) {
    picker.innerHTML = SONGS.map(s =>
      `<button onclick="setSong('${s.id}')" class="${s.id === song.id
        ? 'px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-sm transition-all'
        : 'px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all'}">${s.title}</button>`
    ).join('');
  }

  const phraseRow = document.getElementById('song-phrases');
  if (phraseRow) {
    phraseRow.innerHTML = songPhrases(song).map((p, i) =>
      `<button onclick="playSongPhrase(${i})" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-blue-50 hover:border-blue-300 transition-all">${p.label}</button>`
    ).join('');
  }
}

function playSong() {
  return playSequence(currentSong.notes, { clef: currentSong.clef });
}

function playSongPhrase(index) {
  const phrases = songPhrases(currentSong);
  const phrase = phrases[index];
  if (!phrase) {
    console.error(`playSongPhrase: "${currentSong.title}" has no phrase ${index}.`);
    return false;
  }
  return playSequence(currentSong.notes, {
    clef: currentSong.clef, from: phrase.from, to: phrase.to, loop: true,
  });
}

/* ---- The C major scale ---------------------------------------------
 * Only the ascending form is written down. Coming back down is the same
 * notes and the same fingers in reverse, so deriving it keeps the two from
 * ever disagreeing - and it is also why the thumb turn lands in the right
 * place both ways without being stated twice.
 */
const SCALES = {
  right: {
    label: 'Tay phải', clef: 'treble',
    keys:    ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'],
    fingers: [1, 2, 3, 1, 2, 3, 4, 5],
    // Going up, the thumb passes under the hand at F to reach the rest of
    // the octave; coming down, finger 3 crosses back over it at the same F.
    turn: { index: 3, up: 'Luồn ngón cái xuống dưới bàn tay để bấm nốt Fa.',
            down: 'Bắc ngón 3 qua ngón cái để đi tiếp xuống.' },
  },
  left: {
    label: 'Tay trái', clef: 'bass',
    keys:    ['c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3', 'c/4'],
    fingers: [5, 4, 3, 2, 1, 3, 2, 1],
    turn: { index: 5, up: 'Bắc ngón 3 qua ngón cái để bấm nốt La.',
            down: 'Luồn ngón cái xuống dưới bàn tay khi đi xuống qua nốt La.' },
  },
};

// Up the octave and back down. The top note is not struck twice, and the
// last note is held for two beats so the whole thing fills four bars of 4/4.
function scalePassage(hand) {
  const scale = SCALES[hand];
  if (!scale) {
    console.error(`scalePassage: there is no "${hand}" scale.`);
    return null;
  }
  const up = scale.keys.map((key, i) => ({ key, finger: scale.fingers[i], dur: 'q' }));
  const down = up.slice(0, -1).reverse().map(item => ({ ...item }));
  down[down.length - 1].dur = 'h';
  return up.concat(down);
}

let scaleHand = 'right';

function setScaleHand(hand) {
  if (!SCALES[hand]) {
    console.error(`setScaleHand: there is no "${hand}" scale.`);
    return false;
  }
  scaleHand = hand;
  showScale();
  return true;
}

function showScale() {
  const scale = SCALES[scaleHand];
  const passage = scalePassage(scaleHand);
  renderScoreSystems('scale-score', passage, scale.clef, { timeSig: '4/4', height: 180 });

  const note = document.getElementById('scale-turn');
  if (note) note.innerText = `Đi lên: ${scale.turn.up}  ·  Đi xuống: ${scale.turn.down}`;

  for (const hand of Object.keys(SCALES)) {
    const btn = document.getElementById(`scale-btn-${hand}`);
    if (btn) {
      btn.className = hand === scaleHand
        ? 'px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-sm transition-all'
        : 'px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all';
    }
  }
}

function playScale() {
  const scale = SCALES[scaleHand];
  const passage = scalePassage(scaleHand);
  if (!passage) return false;
  // Show the fingering on the keys as well, so the hand shape is visible
  // rather than only readable off the staff.
  const fingering = {};
  scale.keys.forEach((key, i) => { fingering[key] = scale.fingers[i]; });
  setKeyFingering(fingering);
  return playSequence(passage, { clef: scale.clef });
}

// A plain reading exercise, not a tune: two bars of 4/4 that between them
// use every note shape and rest the renderer knows, so the passage doubles
// as the first place any of T1-T4 is visible on the page.
const DEMO_PHRASE = [
  { key: 'c/4', dur: 'q', finger: 1 },
  { key: 'd/4', dur: 'q', finger: 2 },
  { key: 'e/4', dur: 'q', finger: 3 },
  { rest: true, dur: 'q' },
  { key: 'e/4', dur: 'e', finger: 3 },
  { key: 'f/4', dur: 'e', finger: 4 },
  { key: 'g/4', dur: 'h', finger: 5 },
  { rest: true, dur: 'q' },
];

function renderDemoPhrase() {
  renderScoreSystems('demo-score', DEMO_PHRASE, 'treble', { timeSig: '4/4', height: 170 });
}

function toggleDemoPlayback() {
  if (player.playing) { pauseSequence(); return; }
  if (player.items === DEMO_PHRASE && player.cursor > player.from) { resumeSequence(); return; }
  const loopBox = document.getElementById('player-loop');
  playSequence(DEMO_PHRASE, { clef: 'treble', loop: Boolean(loopBox && loopBox.checked) });
}

function buildIntervalButtons() {
  const row = document.getElementById('interval-buttons');
  if (!row) return;
  row.innerHTML = INTERVAL_STEPS.map(step =>
    `<button onclick="showInterval('${step.key}')" class="chord-btn">Quãng ${step.number}</button>`
  ).join('');
}

function buildBeatLights() {
  const row = document.getElementById('metronome-beats');
  if (!row) return;
  let html = '';
  for (let i = 0; i < metronome.beatsPerBar; i++) {
    html += `<span class="beat-dot${i === 0 ? ' beat-dot-accent' : ''}" id="beat-dot-${i}"></span>`;
  }
  row.innerHTML = html;
}

function lightBeat(beat) {
  for (let i = 0; i < metronome.beatsPerBar; i++) {
    const dot = document.getElementById(`beat-dot-${i}`);
    if (dot) dot.classList.remove('beat-dot-lit');
  }
  if (beat === null) return;
  const dot = document.getElementById(`beat-dot-${beat}`);
  if (dot) dot.classList.add('beat-dot-lit');
}

function playCurrentAudio() {
  if (currentSelectedNote && currentSelectedNote.freq) {
    playTone(currentSelectedNote.freq);
  }
}

// Handle Piano Key Clicks
function handleKeyClick(key) {
  const match = notesData[currentClef].find(n => n.key === key);

  if (match) {
    currentSelectedNote = match;
    updatePracticeDisplay();
    playTone(match.freq, { voice: key });
    highlightKey(key);
  }
  // On an organ the left hand names the chord for the accompaniment.
  handleSingleFinger(key);

  // Every press is judged, whether it came from the mouse or the keyboard.
  gradeKeyPress(key);
}

// Key Highlight Animation
function highlightKey(key) {
  document.querySelectorAll('.white-key, .black-key').forEach(el => el.classList.remove('active'));
  const activeEl = document.getElementById(`key-${key.replace('/', '_')}`);
  if (activeEl) {
    activeEl.classList.add('active');
    setTimeout(() => activeEl.classList.remove('active'), 300);
  }
}

// Update Practice Section UI
function updatePracticeDisplay() {
  renderScoreSVG('svg-score-container', [{ key: currentSelectedNote.key }], currentClef, 340, 160);

  document.getElementById('info-note-badge').innerText = currentSelectedNote.noteName || 'Nốt';
  document.getElementById('info-note-name').innerText = `${currentSelectedNote.name} (${currentSelectedNote.noteName || ''})`;
  document.getElementById('info-note-desc').innerText = currentSelectedNote.desc || 'Thực hành bấm phím đàn để nghe âm thanh.';
  document.getElementById('info-clef-label').innerText = currentClef === 'treble' ? 'Khóa Sol (Tay Phải)' : 'Khóa Fa (Tay Trái)';
}

// Switch Clef
function setClef(clef) {
  currentClef = clef;
  currentSelectedNote = clef === 'treble' ? notesData.treble[3] : notesData.bass[7]; // C4 or C3
  
  const trebleBtn = document.getElementById('clef-treble-btn');
  const bassBtn = document.getElementById('clef-bass-btn');

  if (clef === 'treble') {
    trebleBtn.className = "px-3 py-1 text-xs font-bold rounded-md bg-white text-blue-600 shadow-sm";
    bassBtn.className = "px-3 py-1 text-xs font-bold rounded-md text-slate-600 hover:text-slate-900";
    scrollKeyboardTo('C4');
  } else {
    bassBtn.className = "px-3 py-1 text-xs font-bold rounded-md bg-white text-blue-600 shadow-sm";
    trebleBtn.className = "px-3 py-1 text-xs font-bold rounded-md text-slate-600 hover:text-slate-900";
    scrollKeyboardTo('C3');
  }

  updatePracticeDisplay();
}

// Render Visual Guides (Tab 2)
function renderGuideDiagrams() {
  // Guide 1: Step vs Skip (Treble)
  renderScoreSVG('guide-svg-1', [
    { key: "c/4", label: "Gốc" },
    { key: "d/4", label: "Liền kề" },
    { key: "f/4", label: "Nhảy cách" }
  ], 'treble', 260, 130);

  // Guide 2: Anchor Notes (Treble)
  renderScoreSVG('guide-svg-2', [
    { key: "c/4", label: "C4 (Đô)" },
    { key: "g/4", label: "G4 (Sol)" },
    { key: "c/5", label: "C5 (Đô)" }
  ], 'treble', 260, 130);

  // Guide 3: F-A-C-E Rule (Treble)
  renderScoreSVG('guide-svg-3', [
    { key: "f/4", label: "F" },
    { key: "a/4", label: "A" },
    { key: "c/5", label: "C" },
    { key: "e/5", label: "E" }
  ], 'treble', 260, 130);

  // Guide 4: Anchor Notes (Bass)
  renderScoreSVG('guide-svg-4', [
    { key: "c/3", label: "C3 (Đô)" },
    { key: "f/3", label: "F3 (Pha)" },
    { key: "c/4", label: "C4 (Đô)" }
  ], 'bass', 260, 130);

  // Guide 5: Space Notes (Bass: A2-C3-E3-G3)
  renderScoreSVG('guide-svg-5', [
    { key: "a/2", label: "A" },
    { key: "c/3", label: "C" },
    { key: "e/3", label: "E" },
    { key: "g/3", label: "G" }
  ], 'bass', 260, 130);

  // Guide 6: Line Notes (Bass: G2-B2-D3-F3-A3)
  renderScoreSVG('guide-svg-6', [
    { key: "g/2", label: "G" },
    { key: "b/2", label: "B" },
    { key: "d/3", label: "D" },
    { key: "f/3", label: "F" }
  ], 'bass', 260, 130);
}

// Quiz Engine Functions
function startQuizNextQuestion() {
  const clefSelect = document.getElementById('quiz-clef-select').value;
  const rangeSelect = document.getElementById('quiz-range-select').value;

  let activeClef = currentClef;
  if (clefSelect === 'both') {
    activeClef = Math.random() > 0.5 ? 'treble' : 'bass';
  } else {
    activeClef = clefSelect;
  }

  let pool = notesData[activeClef];
  if (rangeSelect === 'normal') {
    pool = pool.filter(n => n.tag === 'normal');
  } else if (rangeSelect === 'accidental') {
    pool = pool.filter(n => n.tag === 'accidental');
  } else {
    pool = pool.filter(n => n.tag !== 'accidental'); // naturals, ledger lines included
  }

  const randomNote = pool[Math.floor(Math.random() * pool.length)];
  quizCurrentQuestion = { ...randomNote, clef: activeClef };

  // Update Quiz Clef Label
  document.getElementById('quiz-clef-label').innerText = activeClef === 'treble' ? 'Khóa Sol' : 'Khóa Fa';

  // Render Question Score
  renderScoreSVG('quiz-svg-container', [{ key: randomNote.key }], activeClef, 280, 150);

  // Create 4 Choices
  let options = [randomNote];
  const fullList = pool; // distractors must come from the same range as the question
  while (options.length < 4) {
    const randOpt = fullList[Math.floor(Math.random() * fullList.length)];
    if (!options.some(o => o.key === randOpt.key)) {
      options.push(randOpt);
    }
  }
  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML = '';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "px-4 py-3 bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl font-bold text-slate-800 transition-all text-sm shadow-sm active:scale-95";
    btn.innerText = `${opt.name} (${opt.noteName})`;
    btn.onclick = () => checkQuizAnswer(opt);
    optionsEl.appendChild(btn);
  });

  document.getElementById('quiz-feedback').className = "p-3 rounded-xl text-sm font-bold hidden transition-all max-w-md mx-auto";
}

function checkQuizAnswer(selectedOption) {
  const feedbackEl = document.getElementById('quiz-feedback');
  feedbackEl.classList.remove('hidden');

  if (selectedOption.key === quizCurrentQuestion.key) {
    // Correct
    quizScore += 10;
    quizStreak += 1;
    playTone(quizCurrentQuestion.freq);

    feedbackEl.className = "p-3 rounded-xl text-sm font-bold max-w-md mx-auto bg-emerald-100 text-emerald-800 border border-emerald-200 block";
    feedbackEl.innerText = ` Chính xác! Đáp án đúng là ${quizCurrentQuestion.name} (${quizCurrentQuestion.noteName}).`;

    setTimeout(startQuizNextQuestion, 1200);
  } else {
    // Incorrect
    quizStreak = 0;
    feedbackEl.className = "p-3 rounded-xl text-sm font-bold max-w-md mx-auto bg-rose-100 text-rose-800 border border-rose-200 block";
    feedbackEl.innerText = ` Chưa đúng! Đây là nốt ${quizCurrentQuestion.name} (${quizCurrentQuestion.noteName}). Thử lại nhé!`;
  }

  document.getElementById('quiz-score').innerText = quizScore;
  document.getElementById('quiz-streak').innerText = quizStreak;
}

// Tab Navigation Switcher
function switchTab(tab) {
  document.getElementById('tab-practice').classList.add('hidden');
  document.getElementById('tab-guide').classList.add('hidden');
  document.getElementById('tab-quiz').classList.add('hidden');
  document.getElementById('tab-lessons').classList.add('hidden');

  document.getElementById('tab-btn-practice').className = "px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-all";
  document.getElementById('tab-btn-guide').className = "px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-all";
  document.getElementById('tab-btn-quiz').className = "px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-all";
  document.getElementById('tab-btn-lessons').className = "px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-all";

  if (tab === 'practice') {
    document.getElementById('tab-practice').classList.remove('hidden');
    document.getElementById('tab-btn-practice').className = "px-4 py-2 rounded-lg bg-blue-600 text-white shadow-sm transition-all";
    updatePracticeDisplay();
  } else if (tab === 'guide') {
    document.getElementById('tab-guide').classList.remove('hidden');
    document.getElementById('tab-btn-guide').className = "px-4 py-2 rounded-lg bg-blue-600 text-white shadow-sm transition-all";
    renderGuideDiagrams();
  } else if (tab === 'quiz') {
    document.getElementById('tab-quiz').classList.remove('hidden');
    document.getElementById('tab-btn-quiz').className = "px-4 py-2 rounded-lg bg-blue-600 text-white shadow-sm transition-all";
    startQuizNextQuestion();
  } else if (tab === 'lessons') {
    document.getElementById('tab-lessons').classList.remove('hidden');
    document.getElementById('tab-btn-lessons').className = "px-4 py-2 rounded-lg bg-blue-600 text-white shadow-sm transition-all";
    renderLessonList();
    renderLessonDetail();
  }
}

// Window Onload Initialization
window.onload = function() {
  buildPianoKeyboard();
  buildBeatLights();
  buildIntervalButtons();
  buildPracticeSources();
  buildOrganControls();
  showTwoHandPiece('anh-sao-nho-2-tay');
  renderPractice();
  renderEarTraining();
  setTypingOctave(TYPING_OCTAVE.current);
  document.addEventListener('keydown', handleComputerKeyDown);
  renderSpellingDemo();
  showKeySignature('G');
  lessonProgress = loadProgress();
  renderLessonList();
  renderLessonDetail();
  renderDemoPhrase();
  showScale();
  showSong();
  updatePracticeDisplay();
  setTimeout(() => scrollKeyboardTo('C4'), 200);
};
