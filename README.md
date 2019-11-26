# SimpleStrategicSudokuSolver
 The currently fastest Javascript algorithm for easier-than-extreme sudoku
 The currently fastest strategic sudoku solver, although fewer logical notifications
 
 Typical speed for easy to hard sudoku (casual test):
 JCZSolver(rust + Wasm): ~0.3ms
 Kudoku(Javascript): ~0.7ms
 SimpleStrategicSudokuSolver(Javascript): ~0.5ms
 
 Typical speed for extreme sudoku (casual test):
 (sample puzzles:
 ....9..5..1.....3...23..7....45...7.8.....2.......64...9..1.....8..6......54....7
 1.......2.9.4...5...6...7...5.9.3.......7.......85..4.7.....6...3...9.8...2.....1
 ........8..3...4...9..2..6.....79.......612...6.5.2.7...8...5...1.....2.4.5.....3
 1.......2.9.4...5...6...7...5.3.4.......6........58.4...2...6...3...9.8.7.......1)
 sudoku9x9.com(Javascript): > 30000ms
 HoDoKu(Java): ~8000ms
 SimpleStrategicSudokuSolver(Javascript): ~16ms
 *Sudoku Explainer is not on this list because it's too old.
 
 Developed by Alpxcx under GPLv3 Licence
 Version: 1.0.0beta, 22-Nov-2019
