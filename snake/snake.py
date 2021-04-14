#
# CS 224 Python Semester Project
#
# Authors: Daniel Gruber, Timothy Thoman, Darian Boeck
#
# Date: April 4th, 2020
#
# DES: This program is the retro game of SNAKE, Python Version!
#      When ran, a window will open display a black Start screen with some buttons.
#
#   ->Start Game will do as said. ->Options takes you to another black screen where
#   you can select different colors for the snake and food as well as change the
#   game mode. A Back to Start button will do as said and a Exit button (described next)
#   are also on the Options screen. ->Reset Scores will take you to a reset frame that
#   asks you to confirm the reset. ->Exit will close the program (window included).
#   The Back to Start(BTS) and Exit buttons have the same functionality across all screens.
#
#       Once you start the game the Game screen will be displayed that contains:
#   ->A red play box (the snake's home) surrounding the snake head, food, and mines,
#   if in Mines mode. ->On top of the box is a score counter, high score display, and
#   a timer, if in Timed mode. ->Two buttons (BTS and Exit) are also included.
#
#       If the user dies, then a black death screen will be displayed. This screen has:
#   ->A New Game button along with BTS and Exit buttons. New Game will do just that with
#   the same settings the player has chosen at Options. The players score will also be
#   displayed along with a new high score message if that happens.
#
#   	If a user wishes to add new snake/food pattens/colors or snake heads, all the have
#   to do is created the images as PNGs that are 25x25 pixels or less. Then add the names
#   of each to either set COLORS or set HEADS. ->Note: if a color is added, there must be a
#   snake and food version of it; otherwise a default color will be used.
#
import tkinter as tk
import time
import os
import random
import pygame
from random import randint
from PIL import Image, ImageTk

# The root is the window, board is the game canvas, and pop is a pop-up window
global root, board, MODE, PREV_MODE, SNAKE_COLOR, FOOD_COLOR, SNAKE_HEAD, SCORE, NUM_SCORES, TOP_SCORES, GAME_SPEED

# These sets are used for selections on the options screen
COLORS = {"Blue", "Green", "Orange", "Pink", "Purple", "Red", "Yellow"}
MODES = {"Classic", "No-Walls", "Timed", "Mines", "Enemies"}
MODE_LIST = ["Classic", "No-Walls", "Timed", "Mines", "Enemies"]
HEADS = {"Python", "PyCharm", "USA", "UWLAX", "Radioactive", "Skull"}

MOVE_INCREMENT = 20  # Used to create the grid like appearance in the game box
MOVES_PER_SECOND = 13  # Determines how fast the snake moves
BOOM_PER_SECOND = 9


# This class extends the Canvas class and is used to control the game mechanics
class Snake(tk.Canvas):
    # A packed initialization method that adds all of our game components the the superclass
    # Then it calls some class methods to get the ball rolling
    def __init__(self):
        global GAME_SPEED
        super().__init__(width=600, height=620, bg="#696969", highlightthickness=0)
        Sounds.playSongs()
        self.snake_positions = [(randint(1, 29) * 20, randint(2, 30) * 20)]
        self.booms = ''
        self.enemy_snakes = []
        self.num_enemies = 0
        self.mine_positions = []
        self.food_position = self.set_new_food_position()
        self.mine_positions = self.set_mines()
        self.direction = "stop"
        self.score = 0
        self.start_time = 0
        self.time_left = 5.00
        self.highlight = True
        self.boom = False
        self.boom_num = 1

        self.load_assets()
        self.create_objects()
        self.bind_all("<Key>", self.on_key_press)
        self.pack()
        GAME_SPEED = 1000 // MOVES_PER_SECOND
        self.after(GAME_SPEED, self.perform_actions)

    # Loads the images according to user selection for snake and food color
    # as well as the snake head and mines
    # noinspection PyAttributeOutsideInit
    def load_assets(self):
        try:
            self.snake_head = ImageTk.PhotoImage(Image.open(f"./assets/{SNAKE_HEAD}_head.png"))
            self.snake_body = ImageTk.PhotoImage(Image.open(f"./assets/snake_{SNAKE_COLOR.lower()}.png"))

            self.food = ImageTk.PhotoImage(Image.open(f"./assets/food_{FOOD_COLOR.lower()}.png"))
            self.mine = ImageTk.PhotoImage(Image.open("./assets/mine.png"))

            self.enemy_left = ImageTk.PhotoImage(Image.open("./assets/enemy_left.png"))
            self.enemy_right = ImageTk.PhotoImage(Image.open("./assets/enemy_right.png"))
            self.enemy_up = ImageTk.PhotoImage(Image.open("./assets/enemy_up.png"))
            self.enemy_down = ImageTk.PhotoImage(Image.open("./assets/enemy_down.png"))
            self.enemy_body = ImageTk.PhotoImage(Image.open("./assets/enemy_body.png"))

            self.boom_1 = ImageTk.PhotoImage(Image.open("./assets/BOOM_1.png"))
            self.boom_2 = ImageTk.PhotoImage(Image.open("./assets/BOOM_2.png"))
            self.boom_3 = ImageTk.PhotoImage(Image.open("./assets/BOOM_3.png"))
            self.boom_4 = ImageTk.PhotoImage(Image.open("./assets/BOOM_4.png"))
            self.boom_5 = ImageTk.PhotoImage(Image.open("./assets/BOOM_5.png"))
            self.boom_6 = ImageTk.PhotoImage(Image.open("./assets/BOOM_6.png"))
            self.boom_7 = ImageTk.PhotoImage(Image.open("./assets/BOOM_7.png"))
            self.boom_8 = ImageTk.PhotoImage(Image.open("./assets/BOOM_8.png"))
            self.boom_9 = ImageTk.PhotoImage(Image.open("./assets/BOOM_9.png"))
            self.boom_10 = ImageTk.PhotoImage(Image.open("./assets/BOOM_10.png"))

        except IOError as error:
            print(error)
            root.destroy()
            raise

    # Creates every object needed to make the game possible
    # First creates the score texts along with time if in timed mode.
    # Then creates the initial snake and food objects and the mines if in mines mode.
    # Lastly creates the border rectangle.
    def create_objects(self):
        self.create_text(45, 12, text=f"Score: {self.score}", tag="score", fill="#fff", font=10)

        high_score = TOP_SCORES[MODE_LIST.index(MODE)][0]
        self.create_text(190, 12, text=f"Mode: {MODE}", tag="mode", fill="#fff", font=10)

        self.create_text(530, 12, text=f"High Score: {high_score}", tag="high_score", fill="#fff", font=10)

        if MODE == "Timed":
            self.create_text(360, 12, text=f"Time Left: {self.time_left}", tag="time",
                             fill="#fff", font=10)

        self.create_image(self.snake_positions[0], image=self.snake_head, tag="snake")
        self.create_image(*self.food_position, image=self.food, tag="food")

        if MODE == "Mines":
            for mine in self.mine_positions:
                self.create_image(*mine, image=self.mine, tag="mine")

        self.create_rectangle(5, 25, 595, 615, outline="black", tag='box')
        self.create_rectangle(self.snake_positions[0][0] - 13, self.snake_positions[0][1] - 13,
                              self.snake_positions[0][0] + 13, self.snake_positions[0][1] + 13,
                              outline="yellow", tag="highlight")

    # Creates the enemy snakes
    def create_enemies(self):
        num_enemies = randint(1, 5)
        for i in range(num_enemies):
            side = randint(1, 4)
            # Loops until new enemy has its own spot
            while True:
                # left
                if side == 1:
                    x = 20
                    y = randint(3, 29) * 20
                # top
                elif side == 2:
                    x = randint(2, 28) * 20
                    y = 40
                # right
                elif side == 3:
                    x = 580
                    y = randint(3, 29) * 20
                # bottom
                else:
                    x = randint(2, 28) * 20
                    y = 600

                # Checks if the new enemy is in the same place as any other enemies
                if side % 2 == 0:
                    clear = True
                    for s in self.enemy_snakes:
                        if x == s[2][0]:
                            clear = False
                else:
                    clear = True
                    for s in self.enemy_snakes:
                        if y == s[2][1]:
                            clear = False
                if clear and (x, y) not in self.snake_positions[0:1]:
                    break

            snake = [side, self.num_enemies]

            # Creates the enemy images starting with a specific head image
            head = True
            for _ in range(randint(3, 15)):
                if head:
                    if side == 1:
                        self.create_image((x, y), image=self.enemy_right, tag=f"enemy_{self.num_enemies}")
                    elif side == 2:
                        self.create_image((x, y), image=self.enemy_down, tag=f"enemy_{self.num_enemies}")
                    elif side == 3:
                        self.create_image((x, y), image=self.enemy_left, tag=f"enemy_{self.num_enemies}")
                    else:
                        self.create_image((x, y), image=self.enemy_up, tag=f"enemy_{self.num_enemies}")
                    head = False
                else:
                    self.create_image((x, y), image=self.enemy_body, tag=f"enemy_{self.num_enemies}")
                snake.append((x, y))
            self.num_enemies += 1

            self.enemy_snakes.append(snake)

    # Checks the collision of the snake with walls and itself.
    # If the mode is No Walls, then only check for collisions with itself.
    def check_collisions(self):
        if MODE == "No-Walls":
            return self.wrap_snake()
        else:
            head_x, head_y = self.snake_positions[0]

            return (head_x in (0, 600)
                    or head_y in (20, 620)
                    or (head_x, head_y) in self.snake_positions[1:])

    # Used in No Walls mode to wrap the snake to the other side of the box.
    # First grab the snake head position and make sure it's not colliding with its body.
    # Then check if the head has went off screen and move it to the opposite side if so.
    #
    # Returns:
    #   True: the head collided with the body
    #   False: otherwise
    def wrap_snake(self):
        head_x, head_y = self.snake_positions[0]

        if (head_x, head_y) in self.snake_positions[1:]:
            return True

        if head_x > 580:
            head_x = 20
        elif head_x < 20:
            head_x = 580
        if head_y > 600:
            head_y = 40
        elif head_y < 40:
            head_y = 600
        self.snake_positions[0] = (head_x, head_y)

        if (head_x, head_y) in self.snake_positions[1:]:
            return True
        return False

    # Checks for collisions of the snake head with the mines
    # Returns:
    #   True: snake head position is in one of the mine positions
    #   False: otherwise
    def check_obstacles(self):
        return self.snake_positions[0] in self.mine_positions

    # Checks if an enemy has collided with player or if player collided with an enemy.
    # If an enemy hits the player, then it dies and is removed.
    # Also checks if the entire snake has left the box and gets rid of it if so.
    #
    # Returns:
    #   True: player collided with an enemy
    #   False: otherwise
    def check_enemy_collisions(self):
        dead_snakes = []
        snakes = []
        for i in range(len(self.enemy_snakes)):
            if self.snake_positions[0] in self.enemy_snakes[i][2:]:
                return True
            if self.enemy_snakes[i][2] in self.snake_positions:
                for seg in range(2, len(self.enemy_snakes[i])):
                    self.enemy_snakes[i][seg] = (-30, -1 * self.enemy_snakes[i][1] - 30)

                for segment, position in zip(self.find_withtag(f"enemy_{self.enemy_snakes[i][1]}"),
                                             self.enemy_snakes[i][2:]):
                    self.coords(segment, position)

                dead_snakes.append(self.enemy_snakes[i][1])

            # Took this out since I feel that there shouldn't be friendly fire.
            # for s in self.enemy_snakes:
            #     if self.enemy_snakes.index(s) != i and self.enemy_snakes[i][2] in s[2:]:
            #         for seg in range(2, len(self.enemy_snakes[i])):
            #             self.enemy_snakes[i][seg] = (-30, -1 * self.enemy_snakes[i][1] - 30)
            #
            #         for segment, position in zip(self.find_withtag(f"enemy_{self.enemy_snakes[i][1]}"),
            #                                      self.enemy_snakes[i][2:]):
            #             self.coords(segment, position)
            #         dead_snakes.append(self.enemy_snakes[i][1])
            #         break

            # Checks if the snake is completely off-screen if not already dead
            if self.enemy_snakes[i][1] not in dead_snakes:
                gone = True
                for seg in self.enemy_snakes[i][2:]:
                    if seg != (-30, -1 * self.enemy_snakes[i][1] - 30):
                        gone = False
                if gone:
                    dead_snakes.append(self.enemy_snakes[i][1])

        # Creates a new list of living snakes
        for i in range(len(self.enemy_snakes)):
            if self.enemy_snakes[i][1] not in dead_snakes:
                snakes.append(self.enemy_snakes[i])
        self.enemy_snakes = snakes

        return False

    # Checks for collisions of the snake and enemy heads with the food.
    # If they have collided, then: the snake gets longer by one segment,
    # the food gets a new location, the score increments, and finally
    # if the mode is Timed, then the timer gets reset.
    # If an enemy eats the food, it just moves elsewhere.
    def check_food_collision(self):
        if self.snake_positions[0] == self.food_position:
            self.snake_positions.append(self.snake_positions[-1])
            self.create_image(*self.snake_positions[-1], image=self.snake_body, tag="snake")

            self.food_position = self.set_new_food_position()
            self.coords(self.find_withtag("food"), *self.food_position)

            # Update the scores
            self.score += 1
            score = self.find_withtag("score")
            self.itemconfigure(score, text=f"Score: {self.score}", tag="score")
            if self.score > TOP_SCORES[MODE_LIST.index(MODE)][0]:
                high_score = self.find_withtag("high_score")
                self.itemconfigure(high_score, text=f"High Score: {self.score}", tag="high_score")

            # Create enemies every 5 points
            if MODE == "Enemies" and self.score % 5 == 0:
                self.create_enemies()

            # Reset timer and add to it every 5 points
            self.start_time = time.time()
            if self.score % 5 == 0:
                self.time_left += 1

        # Moves the food if an enemy eats it
        if MODE == "Enemies":
            for snake in self.enemy_snakes:
                if snake[2] == self.food_position:
                    self.food_position = self.set_new_food_position()
                    self.coords(self.find_withtag("food"), *self.food_position)

    # Moves the snake.
    # Starts by getting the snake head position and then it checks the direction.
    # Based on direction, the head will be moved by the move increment in that direction.
    # Lastly, the rest of the snake body segments get shifted to the position of the segment ahead.
    def move_snake(self):
        new_head_position = (0, 0)
        head_x, head_y = self.snake_positions[0]

        # go left
        if self.direction == "a" or self.direction == 'Left':
            new_head_position = (head_x - MOVE_INCREMENT, head_y)

        # go right
        elif self.direction == "d" or self.direction == 'Right':
            new_head_position = (head_x + MOVE_INCREMENT, head_y)

        # go down
        elif self.direction == "s" or self.direction == 'Down':
            new_head_position = (head_x, head_y + MOVE_INCREMENT)

        # go up
        elif self.direction == "w" or self.direction == 'Up':
            new_head_position = (head_x, head_y - MOVE_INCREMENT)

        self.snake_positions = [new_head_position] + self.snake_positions[:-1]

        for segment, position in zip(self.find_withtag("snake"), self.snake_positions):
            self.coords(segment, position)

    # Moves the enemy snakes across the board
    def move_enemies(self):
        for i in range(len(self.enemy_snakes)):
            new_head_position = (0, 0)
            head_x, head_y = self.enemy_snakes[i][2]

            if head_x != -30:
                # go right
                if self.enemy_snakes[i][0] == 1:
                    new_head_position = (head_x + MOVE_INCREMENT, head_y)

                # go down
                elif self.enemy_snakes[i][0] == 2:
                    new_head_position = (head_x, head_y + MOVE_INCREMENT)

                # go left
                elif self.enemy_snakes[i][0] == 3:
                    new_head_position = (head_x - MOVE_INCREMENT, head_y)

                # go up
                elif self.enemy_snakes[i][0] == 4:
                    new_head_position = (head_x, head_y - MOVE_INCREMENT)

                if new_head_position[0] in (0, 600) or new_head_position[1] in (20, 620):
                    new_head_position = (-30, -1 * self.enemy_snakes[i][1] - 30)
            else:
                new_head_position = (-30, -1 * self.enemy_snakes[i][1] - 30)

            self.enemy_snakes[i] = self.enemy_snakes[i][0:2] + [new_head_position] + self.enemy_snakes[i][2:-1]

            for segment, position in zip(self.find_withtag(f"enemy_{self.enemy_snakes[i][1]}"),
                                         self.enemy_snakes[i][2:]):
                self.coords(segment, position)

    # Sets the direction based on which keys are pressed.
    # Restricts moving in the opposite direction because that's suicide.
    # Uses a set of movement keys and a set of opposites to accomplish this.
    def on_key_press(self, e):
        new_direction = e.keysym
        all_directions = ("w", "s", "a", "d", 'Up', 'Down', 'Left', 'Right')
        opposites = ({"w", "s"}, {"a", "d"}, {'Up', 'Down'}, {'Left', 'Right'},
                     {"w", "Down"}, {"a", "Right"}, {'Up', 's'}, {'Left', 'd'})

        if new_direction in all_directions and \
                ({new_direction, self.direction} not in opposites or len(self.snake_positions) == 1):
            self.direction = new_direction

    # Updates the scores and shows the death frame.
    def end_game(self):
        global SCORE, PREV_MODE
        SCORE = self.score
        update_scores()
        PREV_MODE = MODE
        Sounds.playSoundEffectBoom("GameOver")
        root.show_frame("DeathPage")

    # Sets the explosion process in motion by:
    #   setting boom flag True,
    #   stopping the snake,
    #   copying the snake positions, and
    #   slowing game speed.
    def post_game(self):
        global GAME_SPEED
        pygame.mixer_music.stop()
        self.boom = True
        self.direction = "stop"
        self.booms = [self.snake_positions[i] for i in range(len(self.snake_positions))]

        if len(self.snake_positions) >= 15:
            i = 15
        else:
            i = len(self.snake_positions)
        while i != 0:
            Sounds.playSoundEffectBoom("Explosion")
            time.sleep(.10)
            i -= 1
        GAME_SPEED = 1000 // BOOM_PER_SECOND

    # Creates the explosion animation based on boom number, and then increment that number.
    # If it passes 10, then the game is ended.
    def explode(self):
        for seg in self.booms:
            self.create_image(seg, image=self.get_boom(self.boom_num))
        self.boom_num += 1
        if self.boom_num > 10:
            self.end_game()

    # Helper that quickly gets the correct explosion image
    def get_boom(self, num):
        if num == 1:
            return self.boom_1
        elif num == 2:
            return self.boom_2
        elif num == 3:
            return self.boom_3
        elif num == 4:
            return self.boom_4
        elif num == 5:
            return self.boom_5
        elif num == 6:
            return self.boom_6
        elif num == 7:
            return self.boom_7
        elif num == 8:
            return self.boom_8
        elif num == 9:
            return self.boom_9
        elif num == 10:
            return self.boom_10

    # The driver function of the game. Basically the heart of the snake.
    # Based on what mode is in play, this calls all of the collision checking methods.
    # Repeatedly calls itself continually like a heartbeat
    def perform_actions(self):
        if not self.boom:
            # Controls a highlight rectangle that helps the player find the snake head.
            if self.direction == 'stop':
                if not self.highlight:
                    self.itemconfigure(self.find_withtag("highlight"), outline="yellow", tag="highlight")
                    self.highlight = True
                else:
                    self.itemconfigure(self.find_withtag("highlight"), outline="#696969", tag="highlight")
                    self.highlight = False
            elif self.highlight:
                self.itemconfigure(self.find_withtag("highlight"), outline="#696969", tag="highlight")
                self.highlight = True

            # Checks for self and maybe wall collisions
            if self.check_collisions():
                self.post_game()

            # Calls different checks based on which mode is used
            if MODE == "Timed":
                self.set_time()
            elif MODE == "Mines":
                if self.check_obstacles():
                    self.post_game()
            elif MODE == "Enemies":
                if len(self.enemy_snakes):
                    self.move_enemies()
                    if self.check_enemy_collisions():
                        self.post_game()

            # Food check
            self.check_food_collision()
            # Restricting movement until player pushes a move key
            if self.direction != "stop":
                self.move_snake()
            else:  # Continually resetting the start time so it's current when the player begins
                self.start_time = time.time()
        else:
            # self.move_snake()
            self.explode()

        # HEARTBEAT
        self.after(GAME_SPEED, self.perform_actions)

    # Sets the food's new position.
    # Continually generates a random location until
    # it gets one that's not in the snake or mines if in Mines mode.
    # Returns:
    #   coordinate tuple: new food position
    def set_new_food_position(self):
        while True:
            x = randint(1, 29) * MOVE_INCREMENT
            y = randint(2, 30) * MOVE_INCREMENT
            food_position = (x, y)

            if food_position not in self.snake_positions:
                if MODE == "Mines":
                    if food_position not in self.mine_positions:
                        return food_position
                elif MODE == "Enemies":
                    clear = True
                    for snake in self.enemy_snakes:
                        if food_position in snake[:-1]:
                            clear = False
                    if clear:
                        return food_position
                else:
                    return food_position

    # Randomly generates the positions of the mines.
    # For each mine it continually generates coordinates until
    # it's not in the same position as the snake head, food, and other mines.
    # Returns:
    #   list of tuples: locations of all of the mines
    def set_mines(self):
        mines = []
        for _ in range(10):
            while True:
                x = randint(1, 29) * MOVE_INCREMENT
                y = randint(2, 30) * MOVE_INCREMENT
                mine = (x, y)

                clear = True
                for m in mines:
                    if x in (m[0] - 20, m[0], m[0] + 20):
                        clear = False
                    if y in (m[1] - 20, m[1], m[1] + 20):
                        clear = False

                if mine not in self.snake_positions and \
                        mine not in self.food_position and \
                        mine not in mines \
                        and clear:
                    mines.append(mine)
                    break
        return mines

    # Used in Timed mode to continually update the time left for the player to eat.
    # Calculates the time left, checks if it's 0 to end game; otherwise sets the displayed time.
    def set_time(self):
        global GAME_SPEED
        if self.direction != "stop":
            time_left = float(self.time_left - (time.time() - self.start_time))
            if time_left <= 0:
                self.post_game()
            else:
                death_time = self.find_withtag("time")
                self.itemconfigure(death_time, text="Time Left: {:.2f}".format(time_left), tag="time")


# Creates the start frame as the opening screen
class StartPage(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#696969")
        self.controller = controller

        label = tk.Label(self, text="Welcome to Snake: Python Version!", bg="#696969", fg="white", font=15)
        start_button = tk.Button(self, text="Start Game", bg="green", fg="black", font=5,
                                 command=lambda: controller.show_frame("GamePage"))
        opt_button = tk.Button(self, text="Options", bg="yellow", fg="black", font=5,
                               command=lambda: controller.show_frame("OptionsPage"))
        reset_button = tk.Button(self, text="Reset Scores", bg="orange", fg="black", font=5,
                                 command=lambda: controller.show_frame("ConfirmPage"))
        quit_button = tk.Button(self, text="Exit", bg="red", fg="black", font=5, command=lambda: root.destroy())
        label.pack(side="top", fill="x", pady=10)
        start_button.pack(pady=1)
        opt_button.pack()
        reset_button.pack(pady=1)
        quit_button.pack()
        Sounds.loadSounds()

class Sounds:
    songs = []
    soundEffects = []
    pygame.mixer.init()

    @staticmethod
    def loadSounds():
        for file in os.listdir("./assets/music"):
            Sounds.songs.append(file)
        for file in os.listdir("./assets/soundeffects"):
            Sounds.soundEffects.append(file)

    @staticmethod
    def playSongs():
        oldDir = os.getcwd()
        os.chdir("./assets/music")

        song = randint(0, len(Sounds.songs) - 1)
        pygame.mixer_music.load(Sounds.songs[song])
        pygame.mixer.music.play()

        os.chdir(oldDir)

    @staticmethod
    def playSoundEffectBoom(sound):
        oldDir = os.getcwd()
        os.chdir("./assets/soundeffects")
        SoundEffect = ""
        if sound == "Explosion":
            SoundEffect = Sounds.soundEffects[4]
        elif sound == "GameOver":
            de = randint(1,len(Sounds.soundEffects) - 1)
            SoundEffect = Sounds.soundEffects[de]

        pygame.mixer.music.load(SoundEffect)
        pygame.mixer.music.play()
        os.chdir(oldDir)


# Creates the game frame for the game
class GamePage(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#696969")
        self.controller = controller
        label = tk.Label(self, text="Don't Die!!", bg="#696969", fg="white", font=15)
        back_to_start = tk.Button(self, text="Back to Start", bg="yellow", fg="black", font=1,
                                  command=lambda: {board.destroy(), controller.show_frame("StartPage"),
                                                   pygame.mixer.music.stop()})
        quit_button = tk.Button(self, text="Exit", bg="red", fg="black", font=5, command=lambda: root.destroy())

        label.pack(side="top", pady=5)
        back_to_start.pack()
        quit_button.pack(pady=1)


# Creates the options frame to chose different options
class OptionsPage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#696969")
        self.controller = controller

        label = tk.Label(self, text="Options: can change snake color and head, food color, and mode.", bg="#696969",
                         fg="white", font=12)
        snake_select = tk.Label(self, text="Select a Snake Color:", bg="#696969", fg="white", font=10)
        food_select = tk.Label(self, text="Select a Food Color:", bg="#696969", fg="white", font=10)
        head_select = tk.Label(self, text="Select a Snake Head: ", bg="#696969", fg="white", font=10)
        mode_select = tk.Label(self, text="Select a Game Mode:", bg="#696969", fg="white", font=10)

        s_color = tk.StringVar(self)
        s_color.set(SNAKE_COLOR)
        s_color_pop = tk.OptionMenu(self, s_color, *COLORS)

        f_color = tk.StringVar(self)
        f_color.set(FOOD_COLOR)
        f_color_pop = tk.OptionMenu(self, f_color, *COLORS)

        s_head = tk.StringVar(self)
        s_head.set(SNAKE_HEAD)
        s_head_pop = tk.OptionMenu(self, s_head, *HEADS)

        game_mode = tk.StringVar(self)
        game_mode.set(MODE)
        game_mode_pop = tk.OptionMenu(self, game_mode, *MODES)

        back_to_start = tk.Button(self, text="Back to Start", bg="yellow", fg="black", font=5,
                                  command=lambda: {set_snake_color(s_color.get()),
                                                   set_food_color(f_color.get()),
                                                   set_game_mode(game_mode.get()),
                                                   set_snake_head(s_head.get()),
                                                   controller.show_frame("StartPage")})
        quit_button = tk.Button(self, text="Exit", bg="red", fg="black", font=5, command=lambda: root.destroy())

        label.pack(pady=5)
        back_to_start.pack()
        quit_button.pack(pady=1)
        snake_select.pack(pady=1, side='top')
        s_color_pop.pack(side='top')
        food_select.pack(pady=1, side='top')
        f_color_pop.pack(side='top')
        head_select.pack(pady=1, side='top')
        s_head_pop.pack(side='top')
        mode_select.pack(pady=1, side='top')
        game_mode_pop.pack(side='top')


# Creates the confirm frame to confirm a score reset
class ConfirmPage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#696969")
        self.controller = controller

        self.label = tk.Label(self, text='Reset your HIGH SCORES?', bg="#696969", fg="white", font=10)
        self.yes_button = tk.Button(self, text="Yes", bg="red", fg="black", font=5,
                                    command=lambda: {reset_scores(),
                                                     controller.show_frame("StartPage")})
        self.no_button = tk.Button(self, text="Cancel", bg="green", fg="black", font=5,
                                   command=lambda: controller.show_frame("StartPage"))

        self.label.pack(pady=10)
        self.yes_button.place(relx=0.25, rely=0.5, anchor='center')
        self.no_button.place(relx=0.75, rely=0.5, anchor='center')


# Creates the death frame when it's game over
class DeathPage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#696969")
        self.controller = controller

        label = tk.Label(self, text="Snake? SNAAAAAAKE!!", bg="#696969", fg="white", font=15)
        new_game = tk.Button(self, text="New Game", bg="green", fg="black", font=5,
                             command=lambda: {board.destroy(), controller.show_frame("GamePage")})
        back_to_start = tk.Button(self, text="Back to Start", bg="yellow", fg="black", font=5,
                                  command=lambda: {board.destroy(), controller.show_frame("StartPage")})
        quit_button = tk.Button(self, text="Exit", bg="red", fg="black", font=5, command=lambda: root.destroy())

        label.pack(side="top", fill="x", pady=10)
        new_game.pack()
        back_to_start.pack(pady=1)
        quit_button.pack()


# Creates the main window for game usage
class MainWindow(tk.Tk):
    def __init__(self, *args, **kwargs):
        tk.Tk.__init__(self, *args, **kwargs)
        self.high_scores = ''
        self.title("SNAKE")
        self.geometry("620x755+%d+%d" %
                      (self.winfo_screenwidth() / 2 - 620 / 2, self.winfo_screenheight() / 2 - 755 / 1.8))
        self.configure(bg="#696969")

        container = tk.Frame(self)
        container.pack(side="top", fill="both", expand=False)
        container.grid_rowconfigure(0, weight=1)
        container.grid_columnconfigure(0, weight=1)

        self.frames = {}
        for F in (StartPage, GamePage, OptionsPage, ConfirmPage, DeathPage):
            page_name = F.__name__
            frame = F(parent=container, controller=self)
            self.frames[page_name] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        self.show_frame("StartPage")

    # Shows the desired frame in the window
    def show_frame(self, page_name):
        self.update_scores_table()
        frame = self.frames[page_name]
        frame.tkraise()
        if page_name == "GamePage":
            start_game()
        elif page_name == "DeathPage":
            board.destroy()

    # Updates the high scores display label
    def update_scores_table(self):
        if self.high_scores != '':
            self.high_scores.pack_forget()
        self.high_scores = tk.Label(self, text=table_scores(), bg="#696969", fg="white", font=15)
        self.high_scores.pack(pady=10)


# Creates a pretty string that displays the high scores
def table_scores():
    scores = ''
    if PREV_MODE != '':
        scores = f'You scored {SCORE} in {PREV_MODE} mode.\n\n'
    scores += 'High Scores per Mode\n\n'
    for mode in MODE_LIST:
        scores += mode
        if MODE_LIST.index(mode) + 1 == len(MODE_LIST):
            scores += '\n'
        else:
            scores += '\t'

    for i in range(NUM_SCORES):
        for m in range(len(MODE_LIST)):
            scores += str(TOP_SCORES[m][i])
            if m + 1 != len(MODE_LIST):
                scores += '\t'
            else:
                scores += '\n'
    return scores


# Resets all of the high scores
def reset_scores():
    global TOP_SCORES, root
    TOP_SCORES = [[0 for _ in range(NUM_SCORES)] for _ in range(len(MODE_LIST))]
    root.update_scores_table()


# Creates the game board and starts the game
def start_game():
    global board
    board = Snake()
    board.place(relx=0.5, rely=0.575, anchor="center")
    board.mainloop()


# Sets the snake color
def set_snake_color(color):
    global SNAKE_COLOR
    SNAKE_COLOR = color


# Sets the food color
def set_food_color(color):
    global FOOD_COLOR
    FOOD_COLOR = color


# Sets the snake head
def set_snake_head(head):
    global SNAKE_HEAD
    SNAKE_HEAD = head


# Sets the game mode
def set_game_mode(game_mode):
    global MODE
    MODE = game_mode


# Updates the high scores of current mode
def update_scores():
    global TOP_SCORES
    idx = MODE_LIST.index(MODE)
    if SCORE > min(TOP_SCORES[idx]):
        TOP_SCORES[idx].pop(NUM_SCORES - 1)
        TOP_SCORES[idx].append(SCORE)
        TOP_SCORES[idx] = sorted(TOP_SCORES[idx], reverse=True)


# Gets all saved statistics
def read_file():
    global TOP_SCORES, MODE, SNAKE_HEAD, SNAKE_COLOR, FOOD_COLOR
    print(os.getcwd())
    with open('stats.txt', 'r') as stats:
        lines = stats.readlines()
        line = lines[0].split()
        MODE = line[0]
        SNAKE_HEAD = line[1]
        SNAKE_COLOR = line[2]
        FOOD_COLOR = line[3]
        for i in range(1, len(lines)):
            if i % 2 == 0:
                scores = []
                for item in lines[i].split():
                    scores.append(int(item))
                TOP_SCORES.append(scores)


# Saves all current statistics
def write_file():
    with open('stats.txt', 'w') as stats:
        stats.write(MODE + ' ' + SNAKE_HEAD + ' ' + SNAKE_COLOR + ' ' + FOOD_COLOR + '\n')
        for mode in MODE_LIST:
            stats.write(mode + '\n')
            for score in TOP_SCORES[MODE_LIST.index(mode)]:
                stats.write(str(score) + ' ')
            stats.write('\n')


# Reads the statistic file then creates the window and finally writes to the stats file
def main():
    global root, PREV_MODE, SCORE, NUM_SCORES, TOP_SCORES
    # Setting defaults of game components
    PREV_MODE = ''
    SCORE = -1
    NUM_SCORES = 5
    TOP_SCORES = []

    read_file()
    root = MainWindow()
    root.mainloop()
    write_file()


# "Run the Trap!"
if __name__ == "__main__":
    main()
