# SimpleStrategicSudokuSolver
 The currently fastest Javascript algorithm for easier-than-extreme sudoku
 The currently fastest strategic sudoku solver, although fewer logical notifications
 
 Typical speed for easy to hard sudoku (casual test):
 JCZSolver(rust + Wasm): ~0.3ms
 Kudoku(Javascript): ~0.7ms
 SimpleStrategicSudokuSolver(Javascript): ~0.5ms
 
 Typical speed for extreme sudoku (casual test):
 (run on the same puzzle ....9..5..1.....3...23..7....45...7.8.....2.......64...9..1.....8..6......54....7)
 sudoku9x9(Javascript): > 30000ms
 sudokuwiki(Javascript + ASP): ~14000ms*
 HoDoKu(Java): ~11000ms
 SimpleStrategicSudokuSolver(Javascript): ~15ms
 *Run on client and affected by network latency. The real speed may be faster.
 
 Developed by Alpxcx under GPLv3 Licence
 Version: 1.0.0beta, 22-Nov-2019
